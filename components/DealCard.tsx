"use client";

import { motion } from "framer-motion";
import { CarFront, Fuel, Gauge, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/card";
import { formatCurrency, formatNumber } from "@/lib/utils";
import type { Car } from "@/lib/types";

export function DealCard({
  car,
  currency,
  onInquire,
}: {
  car: Car;
  currency: string;
  onInquire: (car: Car) => void;
}) {
  const specs = [
    { icon: Gauge, label: `${formatNumber(car.mileage)} mi` },
    { icon: Settings2, label: car.transmission },
    { icon: Fuel, label: car.fuel },
  ].filter((spec) => spec.label);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/40 transition-colors duration-300 hover:border-slate-700"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
        {car.images[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={car.images[0]}
            alt={`${car.year} ${car.make} ${car.model}`}
            loading="lazy"
            className="size-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-slate-700">
            <CarFront className="size-14" strokeWidth={1.25} />
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          {car.featured && (
            <Badge className="bg-slate-950/60 backdrop-blur-xl">Featured</Badge>
          )}
          {car.status === "reserved" && <Badge tone="amber">Reserved</Badge>}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-sm font-medium text-slate-500">
          {car.year} · {car.bodyType}
        </p>
        <h3 className="mt-1 text-xl font-bold tracking-tight text-slate-100">
          {car.make} {car.model}
        </h3>

        <ul className="mt-4 flex flex-wrap gap-2">
          {specs.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-800/80 bg-white/5 px-3 py-1 text-xs text-slate-300"
            >
              <Icon className="size-3.5 text-slate-500" />
              {label}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-end justify-between gap-4 pt-6">
          <p className="text-2xl font-bold tracking-tight text-slate-100">
            {formatCurrency(car.price, currency)}
          </p>
          <Button size="sm" variant="secondary" onClick={() => onInquire(car)}>
            Inquire
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
