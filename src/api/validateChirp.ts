import type { Request, Response } from "express";

type RequestData = {
  body: string
}

type ResponseError = {
  error: string
}

type ResponseData = {
  valid: true
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
      error: "Chirp is too long"
    };
    res.status(400).send(JSON.stringify(respBody));
    return;
  }

  const respBody: ResponseData = {
      valid: true
  };
  res.status(200).send(JSON.stringify(respBody));
}