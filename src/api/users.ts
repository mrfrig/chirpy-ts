import type { Request, Response } from "express";
import { createUser, getUserByEmail } from "../db/queries/users.js";
import { NewUser } from "../db/schema.js";
import { BadRequestError, ResponseError, UnauthorizedError } from "../middlewares/errorHandler.js";
import { checkPasswordHash } from "../utils/auth.js";

type RequestData = {
  "email": string,
  "password": string
}

type UserResponse = Omit<NewUser, "hashedPassword">;

export async function handlerCreateNewUsers(req: Request, res: Response) {
  const data = validateUserRequestData(req.body);
  const {email, password}: RequestData = data;
  const result = await createUser(email, password);
  res.set("Content-Type", "application/json");
  res.status(201).send(removeHashedPassword(result));
}

export async function handlerLogin(req: Request, res: Response) {
  const data = validateUserRequestData(req.body);
  const {email, password}: RequestData = data;
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
  res.status(200).send(removeHashedPassword(user));
}

function removeHashedPassword(user:NewUser): UserResponse {
  const {hashedPassword: _, ...result} = user;
  return result;
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