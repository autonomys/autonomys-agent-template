import {
  createAllSchedulerTools,
  createApiServer,
  CreateApiServerParams,
  createPrompts,
  OrchestratorRunnerOptions,
} from '@autonomys/agent-core';

import { createExperienceConfig } from './experiences.js';
import { ConfigInstance, Tools } from './types.js';

export const createOrchestratorConfig = async (configInstance: ConfigInstance, tools: Tools) => {
  const { config, characterName } = configInstance;
  const { characterConfig } = config;
  const { characterPath } = characterConfig;

  const createApi = () => {
    const { apiSecurityConfig, llmConfig, API_PORT } = config;

    const apiConfig: OrchestratorRunnerOptions['apiConfig'] = {
      apiEnabled: true,
      authFlag: apiSecurityConfig.ENABLE_AUTH,
      authToken: apiSecurityConfig.API_TOKEN,
      allowedOrigins: apiSecurityConfig.CORS_ALLOWED_ORIGINS,
      port: API_PORT,
    };

    const serverApiServerParams: CreateApiServerParams = {
      characterName,
      dataPath: characterPath,
      llmConfig,
      authFlag: apiConfig.authFlag ?? false,
      authToken: apiConfig.authToken ?? '',
      apiPort: apiConfig.port ?? 3000,
      allowedOrigins: apiConfig.allowedOrigins ?? [],
    };

    createApiServer(serverApiServerParams);
    return apiConfig;
  };

  const apiConfig = config.ENABLE_API ? createApi() : undefined;

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
    llmConfig: config.llmConfig,
    modelConfigurations: config.orchestratorConfig.model_configurations,
    tools: [...schedulerTools, ...tools],
  };

  return orchestratorConfig;
};
