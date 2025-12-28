import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const cars = pgTable("cars", {
    id: serial("id").primaryKey(),
    make: text("make").notNull(),
    model: text("model").notNull(),
    year: integer("year").notNull(),
    color: text("color").notNull(),
    mileage: integer("mileage").notNull(),
    price: integer("price").notNull(),
    description: text("description").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});

export type Car = typeof cars.$inferSelect;
export type NewCar = typeof cars.$inferInsert;
