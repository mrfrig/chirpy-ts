import type { Request, Response } from "express";
import { config } from "../config.js";
import { createUser, updateUser } from "../db/queries/users.js";
import { NewUser } from "../db/schema.js";
import { getBearerToken, validateJWT } from "../utils/auth.js";
import { BadRequestError } from "./errors.js";
import { respondWithJSON } from "./json.js";

export type UserRequestData = {
  "email": string,
  "password": string
}

export type UserResponse = Omit<NewUser, "hashedPassword">;

export async function createNewUsersHandler(req: Request, res: Response) {
  const data = validateUserRequestData(req.body);
  const {email, password}: UserRequestData = data;
  const user = await createUser(email, password);

  respondWithJSON(res, 201, {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  } satisfies UserResponse);
}

export async function updateUserHandler(req: Request, res: Response) {
  const data = validateUserRequestData(req.body);
  const {email, password}: UserRequestData = data;
  const token = getBearerToken(req);
  const userId = validateJWT(token, config.api.secret);

  const user = await updateUser(userId, email, password);
  respondWithJSON(res, 200, {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  } satisfies UserResponse);
}

export function validateUserRequestData(data: Record<string, unknown>) : UserRequestData {
  if (!("email" in data)) {
    throw new BadRequestError("Missing email param");
  }

  if (!("password" in data)) {
    throw new BadRequestError("Missing password param");
  }

  return data as UserRequestData;
}