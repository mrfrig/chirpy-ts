import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { API_CONFIG } from "../config.js";
import * as schema from "./schema.js";

const conn = postgres(API_CONFIG.dbURL);
export const db = drizzle(conn, { schema });