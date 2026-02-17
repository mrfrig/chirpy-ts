import type { Request, Response } from "express";
import { config } from "../config.js";
import { resetChirps } from "../db/queries/chirps.js";
import { resetUsers } from "../db/queries/users.js";
import { ForbiddenError, ResponseError } from "./errors.js";


export function handlerMetrics(req: Request, res: Response) {
  res.set("Content-Type", "text/html; charset=utf-8");
  res.send(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.api.fileserverHits} times!</p>
  </body>
</html>`);
}

export async function handlerReset(req: Request, res: Response) {
  if (config.api.platform !== "dev") {
    const respBody: ResponseError = {
        error: "Forbidden endpoint"
    };
    throw new ForbiddenError(JSON.stringify(respBody));
  }
  await resetUsers();
  await resetChirps();
  config.api.fileserverHits = 0;
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.send("OK");
}