import { createOrchestratorConfig } from './config/orchestrator.js';
import { ConfigInstance } from './config/types.js';
import { createTwitterTool } from './tools.js';

export const createAgentRunnerOptions = async (configInstance: ConfigInstance) => {
  // Define custom tools
  const twitterAgent = await createTwitterTool(configInstance);

  // Collect custom tools into an array to be passed to the orchestrator
  const tools = [twitterAgent].filter(tool => tool !== undefined);

  // Create orchestrator config
  const orchestratorConfig = await createOrchestratorConfig(configInstance, [...tools]);
  return orchestratorConfig;
};
