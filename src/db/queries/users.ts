import { eq } from "drizzle-orm";
import { hashPassword } from "../../utils/auth.js";
import { db } from "../index.js";
import { NewUser, User, users } from "../schema.js";

export async function createUser(email: string, password: string): Promise<NewUser> {
  const [result] = await db
    .insert(users)
    .values({email, hashedPassword: await hashPassword(password)})
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function getUser(userId: string): Promise<User | undefined> {
  const results = await db.select().from(users).where(eq(users.id, userId));

  if (results.length === 0) {
    return undefined;
  }
  return results[0];
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const results = await db.select().from(users).where(eq(users.email, email));

  if (results.length === 0) {
    return undefined;
  }
  return results[0];
}

export async function updateUser(userId:string, email: string, password: string): Promise<User> {
  const [result] = await db
    .update(users)
    .set({email, hashedPassword: await hashPassword(password)})
    .where(eq(users.id, userId))
    .returning();
  return result;
}

export async function resetUsers() {
  await db.delete(users);
}
 
