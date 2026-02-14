import type { MigrationConfig } from "drizzle-orm/migrator";

process.loadEnvFile()

type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig;
}

type APIConfig = {
  fileserverHits: number;
  
};

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};

export const config: {api: APIConfig, db: DBConfig} = {
  api: {fileserverHits: 0,},
  db: {url: envOrThrow("DB_URL"), migrationConfig,}
};

function envOrThrow(key: string) {
  if (!process.env[key]) throw new Error(`${key} env variable missing`);
  return process.env[key];
}