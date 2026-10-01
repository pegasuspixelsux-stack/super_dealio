"use client";

import { DealCard } from "@/components/DealCard";
import type { Car } from "@/lib/types";

export function ListingGrid({
  cars,
  loading,
  currency,
  onInquire,
}: {
  cars: Car[];
  loading: boolean;
  currency: string;
  onInquire: (car: Car) => void;
}) {
  return (
    <section id="inventory" className="mx-auto w-full max-w-7xl scroll-mt-24 px-6 py-16 md:py-24">
      <div className="mb-12 flex items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-100 md:text-4xl">
            Featured inventory
          </h2>
          <p className="mt-3 text-slate-400">Hand-picked vehicles, ready for a test drive.</p>
        </div>
        {!loading && (
          <p className="hidden text-sm text-slate-500 sm:block">
            {cars.length} {cars.length === 1 ? "vehicle" : "vehicles"}
          </p>
        )}
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="h-96 animate-pulse rounded-2xl border border-slate-800/80 bg-surface"
            />
          ))}
        </div>
      ) : cars.length === 0 ? (
        <p className="rounded-2xl border border-slate-800/80 bg-surface px-6 py-16 text-center text-slate-500">
          No vehicles match your search. Try adjusting the filters.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {cars.map((car) => (
              <DealCard key={car.id} car={car} currency={currency} onInquire={onInquire} />
            ))}
        </div>
      )}
    </section>
  );
}
