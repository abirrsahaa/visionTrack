"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: process.env.PORT || 4000,
    databaseUrl: process.env.DATABASE_URL,
    ai: {
        apiKey: process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY || 'mock-key',
        provider: process.env.AI_PROVIDER || 'mock', // 'claude', 'openai', 'mock'
    },
    jwtSecret: process.env.JWT_SECRET || 'super-secret-key',
    env: process.env.NODE_ENV || 'development',
};
