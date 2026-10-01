import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { collection, doc, getDoc, getDocs, limit, query, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

/**
 * Creates the `users/{uid}` profile on first sign-in. The very first account
 * becomes the admin so the dealership always has someone who can manage roles.
 * Enforce this server-side with Firestore security rules in production.
 */
async function ensureProfile(user: User, displayName?: string) {
  const ref = doc(db, "users", user.uid);
  if ((await getDoc(ref)).exists()) return;
  const existing = await getDocs(query(collection(db, "users"), limit(1)));
  await setDoc(ref, {
    email: user.email ?? "",
    displayName: displayName || user.displayName || user.email?.split("@")[0] || "Operator",
    role: existing.empty ? "admin" : "operator",
    createdAt: Date.now(),
  });
}

export async function signInWithEmail(email: string, password: string) {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  await ensureProfile(user);
}

export async function registerWithEmail(name: string, email: string, password: string) {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  if (name) await updateProfile(user, { displayName: name });
  await ensureProfile(user, name);
}

export async function signInWithGoogle() {
  const { user } = await signInWithPopup(auth, new GoogleAuthProvider());
  await ensureProfile(user);
}

export function signOut() {
  return firebaseSignOut(auth);
}

export function authErrorMessage(error: unknown) {
  const code = (error as { code?: string })?.code ?? "";
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password.";
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/invalid-email":
      return "Enter a valid email address.";
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return "";
    case "auth/too-many-requests":
      return "Too many attempts. Try again in a few minutes.";
    default:
      return "Something went wrong. Please try again.";
  }
}
