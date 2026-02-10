import type { NextFunction, Request, Response } from "express";
import { API_CONFIG } from "../config.js";

export function middlewareMetricsInc(req: Request, res: Response, next: NextFunction) {
  API_CONFIG.fileserverHits += 1;
  next();
}