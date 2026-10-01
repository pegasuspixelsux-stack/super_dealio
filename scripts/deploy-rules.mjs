// Publishes firestore.rules and storage.rules to the Firebase project.
//
// Usage: node scripts/deploy-rules.mjs <service-account.json> [storage-bucket]
// Uses the same local service-account key as seed-cars.mjs (never committed).

import { readFileSync } from "node:fs";
import { cert, initializeApp } from "firebase-admin/app";
import { getSecurityRules } from "firebase-admin/security-rules";

const keyPath = process.argv[2] ?? process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (!keyPath) {
  console.error("Pass the service-account JSON path as the first argument.");
  process.exit(1);
}

const key = JSON.parse(readFileSync(keyPath, "utf8"));
const bucket = process.argv[3] ?? `${key.project_id}.firebasestorage.app`;

initializeApp({ credential: cert(key), storageBucket: bucket });
const rules = getSecurityRules();

await rules.releaseFirestoreRulesetFromSource(readFileSync("firestore.rules", "utf8"));
console.log("Firestore rules published.");

await rules.releaseStorageRulesetFromSource(readFileSync("storage.rules", "utf8"), bucket);
console.log(`Storage rules published to ${bucket}.`);
