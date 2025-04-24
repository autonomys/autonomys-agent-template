import {
  createLogger,
  createOrchestratorRunner,
  getConfig,
  type OrchestratorRunner,
  registerOrchestratorRunner,
  setupSignalHandlers,
  startTaskExecutor,
  withApiLogger,
} from '@autonomys/agent-core';

import { createAgentRunnerOptions } from './agent.js';

const configInstance = await getConfig();
if (!configInstance) {
  throw new Error('Config instance not found');
}

const agentRunnerOptions = await createAgentRunnerOptions(configInstance);

const orchestratorRunner = (() => {
  let runnerPromise: Promise<OrchestratorRunner> | undefined = undefined;
  return async () => {
    if (!runnerPromise) {
      const namespace = 'orchestrator';
      runnerPromise = createOrchestratorRunner(configInstance.config.characterConfig, {
        ...agentRunnerOptions,
        ...withApiLogger(namespace, agentRunnerOptions.apiConfig ? true : false),
      });
      const runner = await runnerPromise;
      registerOrchestratorRunner(namespace, runner);
    }
    return runnerPromise;
  };
})();

// Main function to run the application
const main = async () => {
  try {
    const logger = createLogger('app');
    logger.info('Initializing orchestrator runner...');
    const runner = await orchestratorRunner();

    logger.info('Starting task executor...');
    const _startTaskExecutor = startTaskExecutor(runner, 'orchestrator');

    logger.info('Application initialized and ready to process scheduled tasks');
    return new Promise(() => {});
  } catch (error) {
    const logger = createLogger('app');
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ExitPromptError') {
      logger.info('Process terminated by user');
      process.exit(0);
    }
    logger.error('Failed to start application:', error);
    process.exit(1);
  }
};

setupSignalHandlers();

main();
