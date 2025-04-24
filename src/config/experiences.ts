import { createExperienceManager } from '@autonomys/agent-core';

import { ConfigInstance } from './types.js';

export const createExperienceConfig = async (configInstance: ConfigInstance) => {
  const { autoDriveConfig, blockchainConfig, characterConfig } = configInstance.config;
  const { agentVersion, characterName } = configInstance;
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
            agentPath: characterConfig.characterPath,
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

  return { experienceConfig, monitoringConfig };
};
