import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  apiPrefix: process.env.API_PREFIX || 'api',
  apiVersion: process.env.API_VERSION || 'v1',
  corsOrigins: (process.env.CORS_ORIGINS || '*').split(','),
  swaggerEnabled: process.env.SWAGGER_ENABLED === 'true' || process.env.NODE_ENV !== 'production',
  swaggerPath: process.env.SWAGGER_PATH || 'api/docs',
}));
