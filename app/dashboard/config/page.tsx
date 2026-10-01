"use client";

import { useState, type FormEvent } from "react";
import { doc, setDoc } from "firebase/firestore";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Field, Input, Select, Toggle } from "@/components/ui/field";
import { db } from "@/lib/firebase";
import { useSettings } from "@/lib/firestore";
import type { DealershipSettings } from "@/lib/types";

const currencies = ["USD", "EUR", "GBP", "CAD", "MXN", "AUD"];

export default function ConfigPage() {
  const saved = useSettings();
  // `edits` overlays unsaved changes on top of the live settings document.
  const [edits, setEdits] = useState<Partial<DealershipSettings>>({});
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const settings = { ...saved, ...edits };

  const update = (patch: Partial<DealershipSettings>) => {
    setEdits((current) => ({ ...current, ...patch }));
    setStatus("idle");
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setStatus("saving");
    try {
      await setDoc(doc(db, "settings", "dealership"), settings);
      setEdits({});
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <PageHeader title="Configuration" description="Dealership details and notification preferences." />

      <form onSubmit={save} className="grid max-w-3xl gap-8">
        <Card>
          <CardHeader title="Dealership" description="Shown to customers and used across the dashboard." />
          <div className="grid gap-5 p-6 sm:grid-cols-2">
            <Field label="Dealership name" className="sm:col-span-2">
              <Input
                value={settings.name}
                onChange={(event) => update({ name: event.target.value })}
                required
              />
            </Field>
            <Field label="Currency">
              <Select value={settings.currency} onChange={(event) => update({ currency: event.target.value })}>
                {currencies.map((code) => (
                  <option key={code}>{code}</option>
                ))}
              </Select>
            </Field>
          </div>
        </Card>

        <Card>
          <CardHeader title="Contact" description="How customers and your team reach the dealership." />
          <div className="grid gap-5 p-6 sm:grid-cols-2">
            <Field label="Email">
              <Input
                type="email"
                value={settings.email}
                onChange={(event) => update({ email: event.target.value })}
              />
            </Field>
            <Field label="Phone">
              <Input
                type="tel"
                value={settings.phone}
                onChange={(event) => update({ phone: event.target.value })}
              />
            </Field>
            <Field label="Address" className="sm:col-span-2">
              <Input value={settings.address} onChange={(event) => update({ address: event.target.value })} />
            </Field>
          </div>
        </Card>

        <Card>
          <CardHeader title="Notifications" description="Choose what you want to be told about." />
          <div className="divide-y divide-slate-800/80 px-6">
            <Toggle
              checked={settings.notifyNewLead}
              onChange={(value) => update({ notifyNewLead: value })}
              label="New lead alerts"
              description="Get notified when a customer submits an inquiry."
            />
            <Toggle
              checked={settings.notifyStatusChange}
              onChange={(value) => update({ notifyStatusChange: value })}
              label="Lead status changes"
              description="Get notified when a teammate moves a lead."
            />
            <Toggle
              checked={settings.weeklyDigest}
              onChange={(value) => update({ weeklyDigest: value })}
              label="Weekly digest"
              description="A summary of inventory and sales every Monday."
            />
          </div>
        </Card>

        <div className="flex items-center gap-4">
          <Button type="submit" size="lg" disabled={status === "saving"}>
            {status === "saving" ? "Saving…" : "Save changes"}
          </Button>
          <p aria-live="polite" className="text-sm">
            {status === "saved" && <span className="text-emerald-400">Settings saved.</span>}
            {status === "error" && (
              <span className="text-red-400">Couldn&apos;t save. Check your permissions.</span>
            )}
          </p>
        </div>
      </form>
    </>
  );
}
