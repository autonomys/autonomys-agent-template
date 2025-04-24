import { getConfig, type OrchestratorRunnerOptions } from '@autonomys/agent-core';

export type ConfigInstance = Exclude<
  ReturnType<typeof getConfig> extends Promise<infer T> ? T : never,
  undefined
>;

export type Tools = Exclude<OrchestratorRunnerOptions['tools'], undefined>;
