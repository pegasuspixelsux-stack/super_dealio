// Promotes an existing account to admin (creates its profile if missing).
//
// Usage: node scripts/make-admin.mjs <service-account.json> <email>
// The person must have signed up at /login first. New sign-ups are "pending"
// until an admin approves them, so this is how the very first admin is made.

import { readFileSync } from "node:fs";
import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const [keyPath, email] = process.argv.slice(2);
if (!keyPath || !email) {
  console.error("Usage: node scripts/make-admin.mjs <service-account.json> <email>");
  process.exit(1);
}

initializeApp({ credential: cert(JSON.parse(readFileSync(keyPath, "utf8"))) });

const user = await getAuth().getUserByEmail(email);
const ref = getFirestore().collection("users").doc(user.uid);
const existing = await ref.get();

if (existing.exists) {
  await ref.update({ role: "admin" });
} else {
  await ref.set({
    email: user.email ?? email,
    displayName: user.displayName ?? email.split("@")[0],
    role: "admin",
    createdAt: Date.now(),
  });
}
console.log(`${email} is now an admin.`);
