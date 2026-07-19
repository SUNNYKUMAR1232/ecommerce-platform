export type ServiceConfiguration = {
  databaseUrl: string;
  cacheUrl: string;
  messageBrokerUrl: string;
  featureFlags: Record<string, boolean>;
};
