import { createTwitterAgent, createTwitterApi } from '@autonomys/agent-core';

import { ConfigInstance } from './config/types.js';

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
  const twitterAgent = createTwitterAgent(twitterApi, characterConfig);
  return twitterAgent;
};
