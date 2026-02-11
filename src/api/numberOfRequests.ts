import type { Request, Response } from "express";
import { API_CONFIG } from "../config.js";


export function handlerNumberOfRequests(req: Request, res: Response) {
  res.set("Content-Type", "text/html; charset=utf-8");
  res.send(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${API_CONFIG.fileserverHits} times!</p>
  </body>
</html>`);
}

export function handlerResetNumberOfRequests(req: Request, res: Response) {
  API_CONFIG.fileserverHits = 0;
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.send("OK");
}