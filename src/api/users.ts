import type { Request, Response } from "express";
import { createUser, getUserByEmail } from "../db/queries/users.js";
import { NewUser } from "../db/schema.js";
import { checkPasswordHash, makeJWT } from "../utils/auth.js";
import { BadRequestError, ResponseError, UnauthorizedError } from "./errors.js";
import { respondWithJSON } from "./json.js";
import { config } from "../config.js";

type RequestData = {
  "email": string,
  "password": string
}

type LoginData = RequestData & {
  expiresInSeconds?: number,
}

type UserResponse = Omit<NewUser, "hashedPassword">;

export async function handlerCreateNewUsers(req: Request, res: Response) {
  const data = validateUserRequestData(req.body);
  const {email, password}: RequestData = data;
  const user = await createUser(email, password);

  respondWithJSON(res, 201, {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  } satisfies UserResponse);
}

export async function handlerLogin(req: Request, res: Response) {
  const data = validateUserRequestData(req.body);
  const {email, password, expiresInSeconds}: LoginData = data;
  let expiration = 3600;
  if (expiresInSeconds && expiresInSeconds < expiration) {
    expiration = expiresInSeconds;
  }

  const user = await getUserByEmail(email);
  if (!user) {
    const respBody: ResponseError = {
        error: "incorrect email or password"
    };
    throw new UnauthorizedError(JSON.stringify(respBody));
  }

  const correctPassword = await checkPasswordHash(password, user.hashedPassword);

  if (!correctPassword) {
    const respBody: ResponseError = {
        error: "incorrect email or password"
    };
    throw new UnauthorizedError(JSON.stringify(respBody));
  }

  const token = makeJWT(user.id, expiration, config.api.secret);

  respondWithJSON(res, 200, {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    token: token
  } satisfies UserResponse & {token: string});
}


function validateUserRequestData(data: Record<string, unknown>) : RequestData {
  if (!("email" in data)) {
    const respBody: ResponseError = {
      error: "Missing email param"
    };
    throw new BadRequestError(JSON.stringify(respBody));
  }

  if (!("password" in data)) {
    const respBody: ResponseError = {
      error: "Missing password param"
    };
    throw new BadRequestError(JSON.stringify(respBody));
  }

  return data as RequestData;
}