import * as argon2 from "argon2";
import type { Request } from "express";
import type { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../api/errors.js";

const TOKEN_ISSUER = "chirpy";

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password)
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
  if (!password) return false;
  try {
    return await argon2.verify(hash, password);
  } catch {
    return false;
  }
}

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export function makeJWT(userID: string, expiresIn: number, secret: string): string {
  const iat = Math.floor(Date.now() / 1000);
  const token = jwt.sign(
    {
      iss: TOKEN_ISSUER,
      sub: userID,
      iat: iat,
      exp: iat + expiresIn,
    } satisfies payload,
    secret,
    { algorithm: "HS256" },
  );

  return token;
}

export function validateJWT(tokenString: string, secret: string): string  {
  let decoded: payload;
  try {
    decoded = jwt.verify(tokenString, secret) as JwtPayload;
  } catch (e) {
    throw new UnauthorizedError("Invalid token");
  }

  if (decoded.iss !== TOKEN_ISSUER) {
    throw new UnauthorizedError("Invalid issuer");
  }

  if (!decoded.sub) {
    throw new UnauthorizedError("No user ID in token");
  }

  return decoded.sub;
}

export function getBearerToken(req: Request): string {
  const authorization = req.get('Authorization');

  if (!authorization) {
    throw new UnauthorizedError("Authorization header is missing");
  }

  return authorization.replaceAll("Bearer", "").replaceAll(" ", "");
}