import type { Request, Response } from "express";
import { BadRequestError } from "../middlewares/errorHandler.js";

type RequestData = {
  body: string
}

type ResponseError = {
  error: string
}

type ResponseData = {
  cleanedBody: string
};

export function handlerValidateChirp(req: Request, res: Response) {
  const params: RequestData = req.body;

  if( !("body" in params)) {
    const respBody: ResponseError = {
        error: "Invalid JSON"
    };
    res.status(400).send(JSON.stringify(respBody));
    return;
  }

  if (params.body.length > 140) {
    const respBody: ResponseError = {
      error: "Chirp is too long. Max length is 140"
    };
    throw new BadRequestError(JSON.stringify(respBody));
  }

  let words = params.body.split(" ");
  words = words.map((word) => ["kerfuffle", "sharbert", "fornax"].includes(word.toLocaleLowerCase()) ? "****" : word);

  const respBody: ResponseData = {
      cleanedBody: words.join(" ")
  };
  res.status(200).send(JSON.stringify(respBody));
}