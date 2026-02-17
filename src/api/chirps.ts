import type { Request, Response } from "express";
import { config } from "../config.js";
import { createChirp, getChirp, getChirps } from "../db/queries/chirps.js";
import { NewChirp } from "../db/schema.js";
import { getBearerToken, validateJWT } from "../utils/auth.js";
import { BadRequestError, NotFoundError, ResponseError } from "./errors.js";
import { respondWithJSON } from "./json.js";


export async function handlerCreateChirp(req: Request, res: Response) {
  if( !("body" in req.body)) {
    const respBody: ResponseError = {
        error: "Invalid JSON"
    };
     throw new BadRequestError(JSON.stringify(respBody));
  }

  const token = getBearerToken(req);
  const userId = validateJWT(token, config.api.secret);
  const params: NewChirp = {body: req.body.body, userId};

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

  respondWithJSON(res, 201, result);
}

export async function handlerGetChirps(req: Request, res: Response) {
  const chirps = await getChirps();

  respondWithJSON(res, 200, chirps);
}

export async function handlerGetChirp(req: Request, res: Response) {
  if (typeof req.params["chirpId"] !== "string") {
    const respBody: ResponseError = {
        error: "Invalid param"
    };
     throw new BadRequestError(JSON.stringify(respBody));
  }
  const chirpId = req.params["chirpId"];
  const chirp = await getChirp(chirpId);

  if (!chirp) {
    const respBody: ResponseError = {
        error: "Chirp not found"
    };
     throw new NotFoundError(JSON.stringify(respBody));
  }

  respondWithJSON(res, 200, chirp);
}