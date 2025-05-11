import {
  createAllSchedulerTools,
  createPrompts,
  OrchestratorRunnerOptions,
} from '@autonomys/agent-core';

import { createAgentApi } from './api.js';
import { createExperienceConfig } from './experiences.js';
import { ConfigInstance, Tools } from './types.js';

export const createOrchestratorConfig = async (configInstance: ConfigInstance, tools: Tools) => {
  const { config } = configInstance;
  const { characterConfig } = config;
  const { characterPath } = characterConfig;

  const apiConfig = createAgentApi(configInstance);

  const { experienceConfig, monitoringConfig } = await createExperienceConfig(configInstance);
  const prompts = await createPrompts(characterConfig);
  const schedulerTools = createAllSchedulerTools();
  const orchestratorConfig: OrchestratorRunnerOptions = {
    apiConfig,
    experienceConfig,
    monitoringConfig,
    prompts,
    characterDataPathConfig: {
      dataPath: characterPath,
    },
    modelConfigurations: config.orchestratorConfig.model_configurations,
    tools: [...schedulerTools, ...tools],
  };

  return orchestratorConfig;
};
