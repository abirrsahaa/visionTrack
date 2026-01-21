import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 4000,
  databaseUrl: process.env.DATABASE_URL,
  ai: {
    apiKey: process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY || 'mock-key',
    provider: process.env.AI_PROVIDER || 'mock', // 'claude', 'openai', 'mock'
  },
  jwtSecret: process.env.JWT_SECRET || 'super-secret-key',
  env: process.env.NODE_ENV || 'development',
};
