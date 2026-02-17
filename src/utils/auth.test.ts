import type { Request } from "express";
import { UnauthorizedError } from "../api/errors";
import { beforeAll, describe, expect, it } from "vitest";
import { checkPasswordHash, getBearerToken, hashPassword, makeJWT, validateJWT } from "./auth";

describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });

  it("should return false for an incorrect password", async () => {
    const result = await checkPasswordHash("wrongPassword", hash1);
    expect(result).toBe(false);
  });

  it("should return false when password doesn't match a different hash", async () => {
    const result = await checkPasswordHash(password1, hash2);
    expect(result).toBe(false);
  });

  it("should return false for an empty password", async () => {
    const result = await checkPasswordHash("", hash1);
    expect(result).toBe(false);
  });

  it("should return false for an invalid hash", async () => {
    const result = await checkPasswordHash(password1, "invalidhash");
    expect(result).toBe(false);
  });
});

describe("JWT Token", () => {
  const secret = "secret";
  const wrongSecret = "wrong_secret";
  const userID = "some-unique-user-id";
  let validToken: string;

  beforeAll(() => {
    validToken = makeJWT(userID, 3600, secret);
  });

  it("should create and validate jwt", async () => {
    const result = validateJWT(validToken, secret);
    expect(result).toBe(userID);
  });

  it("should throw error on expired token", async () => {
    const jwt = makeJWT(userID, -50, secret);
    expect(() => validateJWT(jwt, secret)).toThrow(UnauthorizedError);
  });

  it("should throw an error for an invalid token string", () => {
    expect(() => validateJWT("invalid.token.string", secret)).toThrow(
      UnauthorizedError,
    );
  });

  it("should throw error on wrong secret", async () => {
    expect(() => validateJWT(validToken, wrongSecret)).toThrow(UnauthorizedError);
  });

});

describe("Bearer Token", () => {
  it("should get bearer token", async () => {
    const token = "this.is.a.token";
    const result = getBearerToken({
      get: () => `Bearer ${token}`,
    } as unknown as Request);
    expect(result).toBe(token);
  });

  it("should throw error on authorization missing", async () => {
    expect(() => getBearerToken({
      get: () => undefined,
    } as unknown as Request)).toThrow(UnauthorizedError);
  });
});