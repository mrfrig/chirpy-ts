import type { Request, Response } from "express";
import { BadRequestError, ResponseError } from "../middlewares/errorHandler.js";
import { createUser } from "../db/queries/users.js";

type RequestData = {
  "email": string
}

export async function handlerCreateNewUsers(req: Request, res: Response) {
  if( !("email" in req.body)) {
    const respBody: ResponseError = {
        error: "Missing email param"
    };
    throw new BadRequestError(JSON.stringify(respBody));
  }

  const {email}: RequestData = req.body;
  const result = await createUser({email});
  res.set("Content-Type", "application/json");
  res.status(201).send(result);
}