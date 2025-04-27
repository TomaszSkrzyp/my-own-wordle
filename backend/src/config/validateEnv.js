
import dotenv from 'dotenv';
import { cleanEnv, str, port } from 'envalid';

dotenv.config();

// Validate
export const env = cleanEnv(process.env, {
    BACK_PORT: port(),
    FRONT_PORT: port(),
    DB_HOST: str(),
    DB_USER: str(),
    DB_PASSWORD: str(),
    DB_NAME: str(),
    DB_PORT: port(),
    NODE_ENV: str({ choices: ['development', 'production'] }),
    SECRET: str(),
});
