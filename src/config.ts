process.loadEnvFile()

type APIConfig = {
  fileserverHits: number;
  dbURL: string;
};

export const API_CONFIG: APIConfig = {
  fileserverHits: 0,
  dbURL: envOrThrow("DB_URL")
};

function envOrThrow(key: string) {
  if (!process.env[key]) throw new Error(`${key} env variable missing`);
  return process.env[key];
}