"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./db");
const schema_1 = require("./db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Car Inventory API Running");
});
app.post("/cars", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { make, model, year, color, mileage, price, description } = req.body;
        const newCar = yield db_1.db.insert(schema_1.cars).values({
            make,
            model,
            year: Number(year),
            color,
            mileage: Number(mileage),
            price: Number(price),
            description
        }).returning();
        res.json(newCar[0]);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to create car listing" });
    }
}));
app.get("/cars", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allCars = yield db_1.db.select().from(schema_1.cars);
        res.json(allCars);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch cars" });
    }
}));
app.get("/cars/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const car = yield db_1.db.query.cars.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.cars.id, Number(id))
        });
        if (!car)
            return res.status(404).json({ error: "Car not found" });
        res.json(car);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch car" });
    }
}));
app.put("/cars/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { make, model, year, color, mileage, price, description } = req.body;
        const updatedCar = yield db_1.db.update(schema_1.cars)
            .set({
            make,
            model,
            year: Number(year),
            color,
            mileage: Number(mileage),
            price: Number(price),
            description
        })
            .where((0, drizzle_orm_1.eq)(schema_1.cars.id, Number(id)))
            .returning();
        res.json(updatedCar[0]);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to update car listing" });
    }
}));
app.delete("/cars/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield db_1.db.delete(schema_1.cars).where((0, drizzle_orm_1.eq)(schema_1.cars.id, Number(id)));
        res.json({ message: "Car listing deleted" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to delete car listing" });
    }
}));
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
