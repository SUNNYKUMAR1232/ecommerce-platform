export type LogLevel = 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';

export type StructuredLog = {
  timestamp: string;
  serviceName: string;
  environment: string;
  logLevel: LogLevel;
  requestId: string;
  correlationId: string;
  userId?: string;
  message: string;
};
