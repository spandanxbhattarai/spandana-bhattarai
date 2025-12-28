import express, { Request, Response } from "express";
import cors from "cors";
import { db } from "./db";
import { cars } from "./db/schema";
import { eq } from "drizzle-orm";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Car Inventory API Running");
});

app.post("/cars", async (req: Request, res: Response) => {
    try {
        const { make, model, year, color, mileage, price, description } = req.body;
        const newCar = await db.insert(cars).values({
            make,
            model,
            year: Number(year),
            color,
            mileage: Number(mileage),
            price: Number(price),
            description
        }).returning();
        res.json(newCar[0]);
    } catch (error) {
        res.status(500).json({ error: "Failed to create car listing" });
    }
});

app.get("/cars", async (req: Request, res: Response) => {
    try {
        const allCars = await db.select().from(cars);
        res.json(allCars);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch cars" });
    }
});

app.get("/cars/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const car = await db.query.cars.findFirst({
            where: eq(cars.id, Number(id))
        });
        if (!car) return res.status(404).json({ error: "Car not found" });
        res.json(car);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch car" });
    }
});

app.put("/cars/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { make, model, year, color, mileage, price, description } = req.body;
        const updatedCar = await db.update(cars)
            .set({
                make,
                model,
                year: Number(year),
                color,
                mileage: Number(mileage),
                price: Number(price),
                description
            })
            .where(eq(cars.id, Number(id)))
            .returning();
        res.json(updatedCar[0]);
    } catch (error) {
        res.status(500).json({ error: "Failed to update car listing" });
    }
});

app.delete("/cars/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await db.delete(cars).where(eq(cars.id, Number(id)));
        res.json({ message: "Car listing deleted" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete car listing" });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


