import type { Request, Response } from "express";
import { createUser } from "../db/queries/users.js";
import { NewUser } from "../db/schema.js";
import { BadRequestError, ResponseError } from "./errors.js";
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

export function validateUserRequestData(data: Record<string, unknown>) : UserRequestData {
  if (!("email" in data)) {
    throw new BadRequestError("Missing email param");
  }

  if (!("password" in data)) {
    throw new BadRequestError("Missing password param");
  }

  return data as UserRequestData;
}