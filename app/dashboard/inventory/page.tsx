"use client";

import { useState } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { CarFront, Pencil, Plus, Trash2 } from "lucide-react";
import { CarForm } from "@/components/dashboard/CarForm";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { carTone } from "@/components/dashboard/status";
import { Button } from "@/components/ui/button";
import { Badge, Card, EmptyState } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { db, storage } from "@/lib/firebase";
import { useCollection, useSettings } from "@/lib/firestore";
import type { Car } from "@/lib/types";
import { formatCurrency, formatNumber } from "@/lib/utils";

export default function InventoryPage() {
  const { data: cars, loading, error } = useCollection<Car>("cars", { orderByField: "createdAt" });
  const { currency } = useSettings();
  const [editing, setEditing] = useState<Car | null>(null);
  const [open, setOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Car | null>(null);
  const [deleteError, setDeleteError] = useState("");

  const openForm = (car: Car | null) => {
    setEditing(car);
    setOpen(true);
  };

  const remove = async (car: Car) => {
    setDeleteError("");
    try {
      await deleteDoc(doc(db, "cars", car.id));
      // Best effort: orphaned files are harmless, the record is the source of truth.
      await Promise.allSettled(car.imagePaths.filter(Boolean).map((path) => deleteObject(ref(storage, path))));
      setPendingDelete(null);
    } catch {
      setDeleteError("Couldn't delete this vehicle.");
    }
  };

  return (
    <>
      <PageHeader
        title="Inventory"
        description="Add, edit and remove the vehicles shown on your public site."
        action={
          <Button onClick={() => openForm(null)}>
            <Plus className="size-4" />
            Add vehicle
          </Button>
        }
      />

      <Card className="overflow-hidden">
        {error ? (
          <EmptyState>{error}</EmptyState>
        ) : cars.length === 0 ? (
          <EmptyState>{loading ? "Loading inventory…" : "No vehicles yet. Add your first one."}</EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800/80 text-xs tracking-wide text-slate-500 uppercase">
                  <th className="px-6 py-4 font-medium">Vehicle</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium">Mileage</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {cars.map((car) => (
                  <tr key={car.id} className="transition-colors hover:bg-white/[0.02]">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-800/60 text-slate-600">
                          {car.images[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={car.images[0]} alt="" className="size-full object-cover" />
                          ) : (
                            <CarFront className="size-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-100">
                            {car.year} {car.make} {car.model}
                          </p>
                          <p className="text-slate-500">
                            {car.bodyType}
                            {car.featured && " · Featured"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-100">
                      {formatCurrency(car.price, currency)}
                    </td>
                    <td className="px-6 py-4 text-slate-400">{formatNumber(car.mileage)} mi</td>
                    <td className="px-6 py-4">
                      <Badge tone={carTone[car.status]} className="capitalize">
                        {car.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label={`Edit ${car.make} ${car.model}`}
                          onClick={() => openForm(car)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label={`Delete ${car.make} ${car.model}`}
                          onClick={() => setPendingDelete(car)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Edit vehicle" : "Add vehicle"}
      >
        {/* remount per vehicle so the form's initial values and reserved id reset */}
        <CarForm key={editing?.id ?? "new"} car={editing} onDone={() => setOpen(false)} />
      </Modal>

      <Modal
        open={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        title="Delete vehicle?"
      >
        <p className="text-slate-400">
          {pendingDelete && `${pendingDelete.year} ${pendingDelete.make} ${pendingDelete.model}`} and its
          photos will be permanently removed.
        </p>
        {deleteError && <p className="mt-4 text-sm text-red-400">{deleteError}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setPendingDelete(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => pendingDelete && void remove(pendingDelete)}>
            Delete
          </Button>
        </div>
      </Modal>
    </>
  );
}
