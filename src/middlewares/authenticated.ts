import type { NextFunction, Request, Response } from "express";
import { config } from "../config.js";
import { getBearerToken, validateJWT } from "../utils/auth.js";


export function authenticatedMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  
  
}