// Server-specific type definitions
export interface ServerConfig {
  port: number;
  allowedOrigins: string[];
  anthropicApiKey: string;
  nodeEnv: string;
}
