import express from "express";
import { handlerNumberOfRequests, handlerResetNumberOfRequests } from "./api/numberOfRequests.js";
import { handlerReadiness } from "./api/readiness.js";
import { handlerValidateChirp } from "./api/validateChirp.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { middlewareLogResponses } from "./middlewares/logResponses.js";
import { middlewareMetricsInc } from "./middlewares/metricsInc.js";

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
