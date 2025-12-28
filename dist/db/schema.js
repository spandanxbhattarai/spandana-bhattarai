"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cars = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.cars = (0, pg_core_1.pgTable)("cars", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    make: (0, pg_core_1.text)("make").notNull(),
    model: (0, pg_core_1.text)("model").notNull(),
    year: (0, pg_core_1.integer)("year").notNull(),
    color: (0, pg_core_1.text)("color").notNull(),
    mileage: (0, pg_core_1.integer)("mileage").notNull(),
    price: (0, pg_core_1.integer)("price").notNull(),
    description: (0, pg_core_1.text)("description").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
