import { sql } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
  text,
  jsonb,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator(
  (name) => `placely-backoffice_${name}`,
);

// Existing posts model
export const posts = createTable(
  "post",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  }),
);

// export const websiteStatusEnum = pgEnum("status", [
//   "undeployed",
//   "deploying",
//   "deployed",
//   "error",
// ]);

// New website model
export const website = createTable("website", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
  template: varchar("template", { length: 10 }).notNull(), // Enum-like structure
  primaryColor: varchar("primaryColor", { length: 10 }).notNull(),
  title: varchar("title", { length: 256 }).notNull(),
  userId: integer("user_id").references(() => posts.id), // Reference to user model (to be created)
  status: varchar("status", { length: 30 }).notNull().default("undeployed"),
  url: varchar("url", { length: 256 }),
});
