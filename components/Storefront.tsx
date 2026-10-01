"use client";

import { useMemo, useState } from "react";
import { Hero, type Filters } from "@/components/Hero";
import { InquiryModal } from "@/components/InquiryModal";
import { ListingGrid } from "@/components/ListingGrid";
import { useCollection, useSettings } from "@/lib/firestore";
import { isFirebaseConfigured } from "@/lib/firebase";
import { SAMPLE_CARS } from "@/lib/sample-cars";
import type { Car } from "@/lib/types";

export function Storefront({ initialType = "" }: { initialType?: string }) {
  const [filters, setFilters] = useState<Filters>({ query: "", type: initialType, maxPrice: "" });
  const [inquiry, setInquiry] = useState<Car | null>(null);
  const { data, loading } = useCollection<Car>("cars", { orderByField: "createdAt" });
  const { currency } = useSettings();

  const cars = useMemo(() => {
    const source = isFirebaseConfigured ? data : SAMPLE_CARS;
    const query = filters.query.trim().toLowerCase();
    const maxPrice = Number(filters.maxPrice) || Infinity;
    return source
      .filter((car) => car.status !== "sold")
      .filter((car) => !filters.type || car.bodyType === filters.type)
      .filter((car) => car.price <= maxPrice)
      .filter((car) => !query || `${car.make} ${car.model}`.toLowerCase().includes(query))
      .sort((a, b) => Number(b.featured) - Number(a.featured) || b.createdAt - a.createdAt);
  }, [data, filters]);

  return (
    <>
      <Hero filters={filters} onChange={setFilters} />
      <ListingGrid cars={cars} loading={loading} currency={currency} onInquire={setInquiry} />
      <InquiryModal car={inquiry} onClose={() => setInquiry(null)} />
    </>
  );
}
