import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import express from "express";
import postgres from "postgres";
import { handlerMetrics, handlerReset } from "./api/admin.js";
import { loginHandler, refreshHandler, revokeHandler } from "./api/auth.js";
import { handlerCreateChirp, handlerGetChirp, handlerGetChirps } from "./api/chirps.js";
import { handlerReadiness } from "./api/healthz.js";
import { createNewUsersHandler, updateUserHandler } from "./api/users.js";
import { config } from "./config.js";
import { errorMiddleware } from "./middlewares/errorHandler.js";
import { logResponsesMiddleware } from "./middlewares/logResponses.js";
import { metricsIncMiddleware } from "./middlewares/metricsInc.js";

const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(logResponsesMiddleware);

app.use("/app",metricsIncMiddleware, express.static("./src/app"));

app.get("/admin/metrics", handlerMetrics);
app.post("/admin/reset", handlerReset);

app.get("/api/healthz", handlerReadiness);
app.post("/api/chirps", handlerCreateChirp);
app.get("/api/chirps", handlerGetChirps);
app.get("/api/chirps/:chirpId", handlerGetChirp);
app.post("/api/login", loginHandler);
app.post("/api/refresh", refreshHandler);
app.post("/api/revoke", revokeHandler);
app.post("/api/users", createNewUsersHandler);
app.put("/api/users", updateUserHandler);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
