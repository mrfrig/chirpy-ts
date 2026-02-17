import type { NextFunction, Request, Response } from "express";
import { config } from "../config.js";

export function metricsIncMiddleware(req: Request, res: Response, next: NextFunction) {
  config.api.fileserverHits += 1;
  next();
}