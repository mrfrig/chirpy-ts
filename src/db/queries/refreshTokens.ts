import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { NewRefreshToken, RefreshToken, refreshTokens, User } from "../schema.js";

export async function createRefreshToken(data: NewRefreshToken): Promise<NewRefreshToken> {
  const [result] = await db
    .insert(refreshTokens)
    .values(data)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function getRefreshToken(token: string): Promise<RefreshToken | undefined> {
  const results = await db.select().from(refreshTokens).where(eq(refreshTokens.token, token));

  if (results.length === 0) {
    return undefined;
  }
  return results[0];
}

export async function revokeRefreshToken(token: string) {
  const today = new Date();
  const [result] = await db
    .update(refreshTokens)
    .set({revokedAt: today, updatedAt: today})
    .where(eq(refreshTokens.token, token))
    .returning();
  return result;
}