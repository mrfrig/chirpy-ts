import type { Request, Response } from "express";
import { config } from "../config.js";
import { createChirp, deleteChirp, getChirp, getChirps, getChirpsByAuthor } from "../db/queries/chirps.js";
import { NewChirp } from "../db/schema.js";
import { getBearerToken, validateJWT } from "../utils/auth.js";
import { BadRequestError, ForbiddenError, NotFoundError } from "./errors.js";
import { respondWithJSON } from "./json.js";


export async function handlerCreateChirp(req: Request, res: Response) {
  if( !("body" in req.body)) {
     throw new BadRequestError("Invalid JSON");
  }

  const token = getBearerToken(req);
  const userId = validateJWT(token, config.api.secret);
  const params: NewChirp = {body: req.body.body, userId};

  if (params.body.length > 140) {
    throw new BadRequestError("Chirp is too long. Max length is 140");
  }

  let words = params.body.split(" ");
  words = words.map((word) => ["kerfuffle", "sharbert", "fornax"].includes(word.toLocaleLowerCase()) ? "****" : word);
  const cleanedBody = words.join(" ");

  const result = await createChirp({userId: params.userId, body: cleanedBody});

  respondWithJSON(res, 201, result);
}

export async function handlerGetChirps(req: Request, res: Response) {
  let authorId = "";
  let authorIdQuery = req.query.authorId;
  if (typeof authorIdQuery === "string") {
    authorId = authorIdQuery;
  }
  const chirps =  await (authorId ? getChirpsByAuthor(authorId) : getChirps());

  respondWithJSON(res, 200, chirps);
}

export async function handlerGetChirp(req: Request, res: Response) {
  if (typeof req.params["chirpId"] !== "string") {
     throw new BadRequestError("Invalid param");
  }
  const chirpId = req.params["chirpId"];
  const chirp = await getChirp(chirpId);

  if (!chirp) {
     throw new NotFoundError("Chirp not found");
  }

  respondWithJSON(res, 200, chirp);
}

export async function handlerDeleteChirp(req: Request, res: Response) {
  if (typeof req.params["chirpId"] !== "string") {
     throw new BadRequestError("Invalid param");
  }
  const token = getBearerToken(req);
  const userId = validateJWT(token, config.api.secret);
  const chirpId = req.params["chirpId"];
  const chirp = await getChirp(chirpId);

  if (!chirp) {
     throw new NotFoundError("Chirp not found");
  }

  if (chirp.userId !== userId) {
    throw new ForbiddenError("User not allowed to delete this chirp!");
  }

  await deleteChirp(chirpId);
  
  res.status(204).send("Chirp created successfully");
}