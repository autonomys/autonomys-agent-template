import {
  createAllSchedulerTools,
  createTwitterAgent,
  createTwitterApi,
} from '@autonomys/agent-core';

import { createExperienceConfig } from './config/experiences.js';
import { ConfigInstance } from './config/types.js';

const schedulerTools = createAllSchedulerTools();

// Define custom tool creators
export const createTwitterTool = async (configInstance: ConfigInstance) => {
  const { twitterConfig, characterConfig } = configInstance.config;
  if (!twitterConfig || !twitterConfig.USERNAME || !twitterConfig.PASSWORD) {
    return undefined;
  }

  const twitterApi = await createTwitterApi(
    twitterConfig.USERNAME,
    twitterConfig.PASSWORD,
    twitterConfig.COOKIES_PATH,
  );

  const { experienceConfig, monitoringConfig } = await createExperienceConfig(configInstance);
  const twitterAgent = createTwitterAgent(twitterApi, characterConfig, {
    tools: [...schedulerTools],
    postTweets: twitterConfig.POST_TWEETS,
    experienceConfig,
    monitoringConfig,
    modelConfigurations: twitterConfig.model_configurations,
  });
  return twitterAgent;
};
