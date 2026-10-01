"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input, Select } from "@/components/ui/field";
import { BODY_TYPES } from "@/lib/sample-cars";

export interface Filters {
  query: string;
  type: string;
  maxPrice: string;
}

const priceSteps = [25000, 50000, 75000, 100000, 150000];

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (filters: Filters) => void;
}) {
  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });

  return (
    <section className="relative overflow-hidden border-b border-slate-800/80">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgb(51_65_85/0.55),transparent),linear-gradient(to_bottom,transparent_60%,rgb(2_6_23))]"
      />
      <div className="relative mx-auto max-w-7xl px-6 py-16 text-center md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
        >
          <span className="inline-flex items-center rounded-full border border-slate-800/80 bg-white/5 px-3.5 py-1 text-xs font-medium text-slate-300 backdrop-blur-xl">
            New arrivals every week
          </span>
          <h1 className="mx-auto mt-8 max-w-4xl text-5xl font-bold tracking-tight text-slate-100 md:text-7xl">
            Drive something extraordinary.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-slate-400">
            A curated collection of exceptional vehicles, each inspected, priced fairly and ready
            for the road.
          </p>
        </motion.div>

        <motion.form
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            document.getElementById("inventory")?.scrollIntoView({ behavior: "smooth" });
          }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease }}
          className="mx-auto mt-12 grid max-w-4xl gap-3 rounded-3xl border border-white/10 bg-slate-900/60 p-3 shadow-2xl backdrop-blur-xl md:grid-cols-[1fr_180px_180px_auto]"
        >
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-500" />
            <Input
              id="search-input"
              type="search"
              value={filters.query}
              onChange={(event) => set({ query: event.target.value })}
              placeholder="Search make or model"
              aria-label="Search make or model"
              className="h-12 border-transparent bg-white/5 pl-10"
            />
          </div>
          <Select
            value={filters.type}
            onChange={(event) => set({ type: event.target.value })}
            aria-label="Body type"
            className="h-12 border-transparent bg-white/5"
          >
            <option value="">All body types</option>
            {BODY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
          <Select
            value={filters.maxPrice}
            onChange={(event) => set({ maxPrice: event.target.value })}
            aria-label="Maximum price"
            className="h-12 border-transparent bg-white/5"
          >
            <option value="">Any price</option>
            {priceSteps.map((step) => (
              <option key={step} value={step}>
                Under ${step.toLocaleString("en-US")}
              </option>
            ))}
          </Select>
          <motion.button
            type="submit"
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="h-12 rounded-xl bg-slate-100 px-6 text-sm font-semibold text-slate-950 transition-colors hover:bg-white"
          >
            Search
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
}
