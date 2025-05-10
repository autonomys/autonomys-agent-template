import {
  type ChatWorkflow,
  createChatNodeConfig,
  createChatWorkflow,
  createDefaultChatTools,
  createPromptTemplate,
  LLMConfiguration,
} from '@autonomys/agent-core';

import { ConfigInstance } from './types.js';

export const chatAppInstance = (configInstance: ConfigInstance): ChatWorkflow => {
  const { config, characterName } = configInstance;
  const { characterConfig } = config;
  const { characterPath } = characterConfig;

  const modelConfig: LLMConfiguration = {
    model: 'claude-3-5-haiku-latest',
    provider: 'anthropic',
    temperature: 0.5,
  };
  const tools = createDefaultChatTools(characterPath);
  const promptTemplate = createPromptTemplate(characterName);
  const chatNodeConfig = createChatNodeConfig({ modelConfig, tools, promptTemplate });
  const chatAppInstance = createChatWorkflow(chatNodeConfig);
  return chatAppInstance;
};
