import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import express from "express";
import postgres from "postgres";
import { handlerNumberOfRequests, handlerResetNumberOfRequests } from "./api/metrics.js";
import { handlerReadiness } from "./api/healthz.js";
import { handlerValidateChirp } from "./api/validateChirp.js";
import { config } from "./config.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { middlewareLogResponses } from "./middlewares/logResponses.js";
import { middlewareMetricsInc } from "./middlewares/metricsInc.js";

const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(middlewareLogResponses);

app.use("/app",middlewareMetricsInc, express.static("./src/app"));

app.get("/admin/metrics", handlerNumberOfRequests);
app.post("/admin/reset", handlerResetNumberOfRequests);

app.get("/api/healthz", handlerReadiness);
app.post("/api/validate_chirp", handlerValidateChirp);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
