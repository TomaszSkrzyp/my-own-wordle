
import dotenv from 'dotenv';
import { cleanEnv, str, port } from 'envalid';

dotenv.config();


/*
Validates and parses required environment variables.

    Uses `envalid` to enforce presence and types for ports, database credentials,
    node environment, and other configuration, throwing on missing or invalid values.
*/
 const env = cleanEnv(process.env, {
    BACK_PORT: port(),
    FRONT_PORT: port(),
    DB_HOST: str(),
    DB_USER: str(),
    POSTGRES_PASSWORD: str(),
    DB_NAME: str(),
    DB_PORT: port(),
    NODE_ENV: str({ choices: ['development', 'production'] }),
    SECRET: str(),
 });
export { env };
