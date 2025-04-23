import {
  createAllSchedulerTools,
  createApiServer,
  CreateApiServerParams,
  createExperienceManager,
  createPrompts,
  OrchestratorRunnerOptions,
} from '@autonomys/agent-core';

import { ConfigInstance, Tools } from './types.js';

export const createOrchestratorConfig = async (configInstance: ConfigInstance, tools: Tools) => {
  const { config, agentVersion, characterName } = configInstance;
  const { characterConfig, autoDriveConfig, blockchainConfig } = config;
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

  const saveExperiences = autoDriveConfig.AUTO_DRIVE_SAVE_EXPERIENCES;
  const monitoringEnabled = autoDriveConfig.AUTO_DRIVE_MONITORING;
  const experienceManager =
    (saveExperiences || monitoringEnabled) &&
    blockchainConfig.PRIVATE_KEY &&
    blockchainConfig.RPC_URL &&
    blockchainConfig.CONTRACT_ADDRESS &&
    autoDriveConfig.AUTO_DRIVE_API_KEY
      ? await createExperienceManager({
          autoDriveApiOptions: {
            apiKey: autoDriveConfig.AUTO_DRIVE_API_KEY,
            network: autoDriveConfig.AUTO_DRIVE_NETWORK,
          },
          uploadOptions: {
            compression: true,
            password: autoDriveConfig.AUTO_DRIVE_ENCRYPTION_PASSWORD,
          },
          walletOptions: {
            privateKey: blockchainConfig.PRIVATE_KEY,
            rpcUrl: blockchainConfig.RPC_URL,
            contractAddress: blockchainConfig.CONTRACT_ADDRESS,
          },
          agentOptions: {
            agentVersion: agentVersion,
            agentName: characterName,
            agentPath: characterPath,
          },
        })
      : undefined;

  const experienceConfig =
    saveExperiences && experienceManager
      ? {
          saveExperiences: true as const,
          experienceManager,
        }
      : {
          saveExperiences: false as const,
        };

  const monitoringConfig =
    monitoringEnabled && experienceManager
      ? {
          enabled: true as const,
          monitoringExperienceManager: experienceManager,
        }
      : {
          enabled: false as const,
        };
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
