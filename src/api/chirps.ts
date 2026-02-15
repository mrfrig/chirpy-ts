import type { Request, Response } from "express";
import { createChirp, getChirps } from "../db/queries/chirps.js";
import { NewChirp } from "../db/schema.js";
import { BadRequestError, ResponseError } from "../middlewares/errorHandler.js";


export async function handlerCreateChirp(req: Request, res: Response) {
  if( !("body" in req.body && "userId" in req.body)) {
    const respBody: ResponseError = {
        error: "Invalid JSON"
    };
     throw new BadRequestError(JSON.stringify(respBody));
  }

  const params: NewChirp = req.body;

  if (params.body.length > 140) {
    const respBody: ResponseError = {
      error: "Chirp is too long. Max length is 140"
    };
    throw new BadRequestError(JSON.stringify(respBody));
  }

  let words = params.body.split(" ");
  words = words.map((word) => ["kerfuffle", "sharbert", "fornax"].includes(word.toLocaleLowerCase()) ? "****" : word);
  const cleanedBody = words.join(" ");

  const result = await createChirp({userId: params.userId, body: cleanedBody});

  res.set("Content-Type", "application/json");
  res.status(201).send(result);
}

export async function handlerGetChirps(req: Request, res: Response) {
  const chirps = await getChirps();

  res.set("Content-Type", "application/json");
  res.status(200).send(chirps);
}