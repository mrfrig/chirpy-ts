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
  let body = ""; 

  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    let msg = "";
    try {
      const parsedBody = JSON.parse(body) as RequestData;
      if( !("body" in parsedBody)) throw new Error();
      msg = parsedBody.body;
    } catch (error) {
      const respBody: ResponseError = {
        error: "Invalid JSON"
      };
      res.status(400).send(JSON.stringify(respBody));
      return;
    }

    if (msg.length > 140) {
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
  });
}