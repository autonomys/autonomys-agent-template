import { createChatWorkflow, createChatNodeConfig, createDefaultChatTools, LLMConfiguration, createPromptTemplate } from "@autonomys/agent-core";
import { ConfigInstance } from "./types.js";


export const chatAppInstance = async (configInstance: ConfigInstance): Promise<any> => {
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
