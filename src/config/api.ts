import { CreateApiServerParams, OrchestratorRunnerOptions } from '@autonomys/agent-core';

import { chatAppInstance } from './chatNode.js';
import { ConfigInstance } from './types.js';

export const createAgentApi = (configInstance: ConfigInstance) => {
  const { config } = configInstance;
  const { apiSecurityConfig, API_PORT } = config;

  const apiConfig: OrchestratorRunnerOptions['apiConfig'] = {
    apiEnabled: true,
    authFlag: apiSecurityConfig.ENABLE_AUTH,
    authToken: apiSecurityConfig.API_TOKEN,
    allowedOrigins: apiSecurityConfig.CORS_ALLOWED_ORIGINS,
    port: API_PORT,
  };
  return apiConfig;
};

export const createApiServerConfig = (configInstance: ConfigInstance) => {
  const { config, characterName } = configInstance;
  const { characterConfig } = config;
  const { characterPath } = characterConfig;
  const { apiSecurityConfig, API_PORT } = config;

  const serverApiServerParams: CreateApiServerParams = {
    characterName,
    dataPath: characterPath,
    authFlag: apiSecurityConfig.ENABLE_AUTH,
    authToken: apiSecurityConfig.API_TOKEN ?? '',
    apiPort: API_PORT,
    allowedOrigins: apiSecurityConfig.CORS_ALLOWED_ORIGINS,
    chatAppInstance: chatAppInstance(configInstance),
  };

  return serverApiServerParams;
};
