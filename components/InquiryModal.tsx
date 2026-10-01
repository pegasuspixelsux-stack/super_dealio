"use client";

import { useState, type FormEvent } from "react";
import { addDoc, collection } from "firebase/firestore";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import type { Car } from "@/lib/types";

export function InquiryModal({ car, onClose }: { car: Car | null; onClose: () => void }) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const close = () => {
    onClose();
    setSent(false);
    setError("");
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!car) return;
    const form = new FormData(event.currentTarget);
    setSending(true);
    setError("");
    try {
      if (!isFirebaseConfigured) throw new Error("Firebase is not configured.");
      await addDoc(collection(db, "leads"), {
        name: String(form.get("name")),
        email: String(form.get("email")),
        phone: String(form.get("phone")),
        message: String(form.get("message")),
        carId: car.id,
        carLabel: `${car.year} ${car.make} ${car.model}`,
        status: "new",
        createdAt: Date.now(),
      });
      setSent(true);
    } catch {
      setError("We couldn't send your inquiry. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal
      open={car !== null}
      onClose={close}
      title={car ? `Inquire about the ${car.make} ${car.model}` : "Inquire"}
    >
      {sent ? (
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
            <Check className="size-7" />
          </div>
          <p className="text-lg font-semibold">Thanks, we&apos;ll be in touch shortly.</p>
          <Button variant="secondary" onClick={close}>
            Done
          </Button>
        </div>
      ) : (
        <form onSubmit={submit} className="grid gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Name">
              <Input name="name" required autoComplete="name" />
            </Field>
            <Field label="Phone">
              <Input name="phone" type="tel" autoComplete="tel" />
            </Field>
          </div>
          <Field label="Email">
            <Input name="email" type="email" required autoComplete="email" />
          </Field>
          <Field label="Message">
            <Textarea name="message" placeholder="I'd like to schedule a test drive." />
          </Field>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" size="lg" disabled={sending}>
            {sending ? "Sending…" : "Send inquiry"}
          </Button>
        </form>
      )}
    </Modal>
  );
}
