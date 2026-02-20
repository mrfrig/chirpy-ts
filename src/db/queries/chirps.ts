import { asc, eq } from "drizzle-orm";
import { db } from "../index.js";
import { NewChirp, chirps } from "../schema.js";

export async function createChirp(chirp: NewChirp) {
  const [result] = await db
    .insert(chirps)
    .values(chirp)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function getChirps() {
  return await db.select().from(chirps).orderBy(asc(chirps.createdAt));
}

export async function getChirpsByAuthor(authorId: string) {
  return await db.select().from(chirps).where(eq(chirps.userId, authorId)).orderBy(asc(chirps.createdAt));
}

export async function getChirp(chirpId: string) {
  const results = await db.select().from(chirps).where(eq(chirps.id, chirpId));
  return results.length > 0 ? results[0]: undefined;
}

export async function deleteChirp(chirpId: string) {
  await db.delete(chirps).where(eq(chirps.id, chirpId));
}