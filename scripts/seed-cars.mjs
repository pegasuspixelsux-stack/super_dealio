// Seeds the `cars` collection with 12 demo vehicles (photos hotlinked from Unsplash).
//
// Usage: node scripts/seed-cars.mjs [path-to-service-account.json]
// The key can also come from GOOGLE_APPLICATION_CREDENTIALS. It is read locally and
// never committed (temp/ and *adminsdk*.json are git-ignored). Safe to re-run:
// documents use fixed ids, so they are overwritten rather than duplicated.

import { readFileSync } from "node:fs";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const keyPath = process.argv[2] ?? process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (!keyPath) {
  console.error("Pass the service-account JSON path as the first argument.");
  process.exit(1);
}

initializeApp({ credential: cert(JSON.parse(readFileSync(keyPath, "utf8"))) });
const db = getFirestore();

const photo = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

const cars = [
  ["porsche-911-carrera-s", "Porsche", "911 Carrera S", "Coupe", 2023, 142900, 8200, "Automatic", "Gasoline", "Black", true, "photo-1543870157-8f90092e98a2"],
  ["tesla-model-s-plaid", "Tesla", "Model S Plaid", "Sedan", 2024, 94990, 3100, "Automatic", "Electric", "Midnight Silver", true, "photo-1536883442700-ffaa4d76e372"],
  ["land-rover-defender-110", "Land Rover", "Defender 110", "SUV", 2022, 71500, 21400, "Automatic", "Diesel", "Fuji White", false, "photo-1771989492104-1c1b08008050"],
  ["bmw-m4-competition", "BMW", "M4 Competition", "Coupe", 2023, 86400, 11900, "Automatic", "Gasoline", "Portimao Blue", false, "photo-1747868329766-3f63cb760bb0"],
  ["ford-f-150-lightning", "Ford", "F-150 Lightning", "Truck", 2023, 62800, 14500, "Automatic", "Electric", "Oxford White", false, "photo-1605152322346-bd2391778772"],
  ["mercedes-benz-g-550", "Mercedes-Benz", "G 550", "SUV", 2021, 148000, 18700, "Automatic", "Gasoline", "Obsidian Black", false, "photo-1623671228672-7f56ddea1e0b"],
  ["audi-rs-e-tron-gt", "Audi", "RS e-tron GT", "Sedan", 2023, 129900, 6700, "Automatic", "Electric", "Daytona Gray", false, "photo-1536150794560-43f988aec18e"],
  ["chevrolet-corvette-stingray", "Chevrolet", "Corvette Stingray", "Coupe", 2022, 78900, 9800, "Automatic", "Gasoline", "Elkhart Lake Blue", false, "photo-1573448341899-e2daaee4a300"],
  ["toyota-land-cruiser", "Toyota", "Land Cruiser", "SUV", 2024, 87500, 1900, "Automatic", "Hybrid", "Silver", false, "photo-1551254311-d96bb5d8f11f"],
  ["lexus-lc-500-convertible", "Lexus", "LC 500 Convertible", "Convertible", 2022, 98600, 7400, "Automatic", "Gasoline", "Infrared", false, "photo-1577496549804-8b05f1f67338"],
  ["rivian-r1t-adventure", "Rivian", "R1T Adventure", "Truck", 2023, 79900, 12300, "Automatic", "Electric", "Forest Green", false, "photo-1654475677197-93252b0758aa"],
  ["volkswagen-golf-r", "Volkswagen", "Golf R", "Hatchback", 2023, 45800, 8900, "Automatic", "Gasoline", "Lime Green", false, "photo-1751528962027-ac9f0370ff5d"],
];

const HOUR = 60 * 60 * 1000;
const now = Date.now();
const batch = db.batch();

cars.forEach(([id, make, model, bodyType, year, price, mileage, transmission, fuel, color, featured, image], index) => {
  batch.set(db.collection("cars").doc(id), {
    make,
    model,
    bodyType,
    year,
    price,
    mileage,
    transmission,
    fuel,
    color,
    description: `${year} ${make} ${model}. Inspected, serviced and ready for a test drive.`,
    status: id === "mercedes-benz-g-550" ? "reserved" : "available",
    featured,
    images: [photo(image)],
    imagePaths: [], // hotlinked, nothing in Storage to clean up on delete
    // Newest first, spaced an hour apart so the dashboard feed has a real order.
    createdAt: now - index * HOUR,
    soldAt: null,
  });
});

await batch.commit();
console.log(`Seeded ${cars.length} cars into Firestore.`);
