import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  email: varchar("email", { length: 256 }).unique().notNull(),
  hashedPassword: varchar("hashed_password").notNull().default("unset")
});

export const chirps = pgTable("feeds", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  body: text("name").notNull(),
  userId: uuid("user_id").notNull().references(() => users.id, {onDelete: "cascade"}),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type NewChirp = typeof chirps.$inferInsert;