import type { Request, Response } from "express";
import { config } from "../config.js";
import { createRefreshToken, getRefreshToken, revokeRefreshToken } from "../db/queries/refreshTokens.js";
import { getUser, getUserByEmail } from "../db/queries/users.js";
import { checkPasswordHash, getBearerToken, makeJWT, makeRefreshToken } from "../utils/auth.js";
import {  UnauthorizedError } from "./errors.js";
import { respondWithJSON } from "./json.js";
import { UserRequestData, UserResponse, validateUserRequestData } from "./users.js";

type LoginResponse = UserResponse & {token: string, refreshToken: string};

const AccessTokenExpiration = 60 * 60; // 1 hour

export async function loginHandler(req: Request, res: Response) {
  const data = validateUserRequestData(req.body);
  const {email, password}: UserRequestData = data;

  const user = await getUserByEmail(email);
  if (!user) {
    throw new UnauthorizedError("incorrect email or password");
  }

  const correctPassword = await checkPasswordHash(password, user.hashedPassword);

  if (!correctPassword) {
    throw new UnauthorizedError("incorrect email or password");
  }
  
  const today = new Date();
  today.setDate(today.getDate() + 60); // 60 days
  const refreshToken = await createRefreshToken({
    token: makeRefreshToken(),
    userId: user.id,
    expiresAt: today
  });
  
  const accessToken = makeJWT(user.id, AccessTokenExpiration, config.api.secret);

  respondWithJSON(res, 200, {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    token: accessToken,
    refreshToken: refreshToken.token,
    isChirpyRed: user.isChirpyRed
  } satisfies LoginResponse);
}

export async function refreshHandler(req: Request, res: Response) {
  const token = getBearerToken(req);
  const refreshToken = await getRefreshToken(token);

  if (!refreshToken) {
    throw new UnauthorizedError("incorrect refresh token");
  } 
  const today = new Date();
  if (today > refreshToken.expiresAt) {
    throw new UnauthorizedError("refresh token expired");
  }
  if (refreshToken.revokedAt) {
    throw new UnauthorizedError("refresh token revoked");
  }

  const user = await getUser(refreshToken.userId);

  if (!user) {
    throw new Error();
  }

  const accessToken = makeJWT(user.id, AccessTokenExpiration, config.api.secret);

  respondWithJSON(res, 200, {
    "token": accessToken
  });
}

export async function revokeHandler(req: Request, res: Response) {
  const token = getBearerToken(req);
  const refreshToken = await revokeRefreshToken(token);

  if (!refreshToken) {
    throw new UnauthorizedError("incorrect refresh token");
  } 

  res.status(204).send();
}