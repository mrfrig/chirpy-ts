import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponses } from "./middlewares/logResponses.js";
import { middlewareMetricsInc } from "./middlewares/metricsInc.js";
import { handlerNumberOfRequests, handlerResetNumberOfRequests } from "./api/numberOfRequests.js";

const app = express();
const PORT = 8080;

app.use(middlewareLogResponses);

app.use("/app",middlewareMetricsInc, express.static("./src/app"));

app.get("/admin/metrics", handlerNumberOfRequests);
app.get("/admin/reset", handlerResetNumberOfRequests);

app.get("/api/healthz", handlerReadiness);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
