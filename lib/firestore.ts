"use client";

import { useEffect, useState } from "react";
import {
  collection,
  doc,
  limit as limitTo,
  onSnapshot,
  orderBy,
  query,
  type QueryConstraint,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { DEFAULT_SETTINGS, type DealershipSettings } from "@/lib/types";

interface CollectionOptions {
  orderByField?: string;
  direction?: "asc" | "desc";
  max?: number;
  enabled?: boolean;
}

interface Snapshot<T> {
  data: T[];
  error: string | null;
}

/** Live subscription to a Firestore collection. Each doc is returned with its `id`. */
export function useCollection<T extends { id: string }>(
  name: string,
  { orderByField, direction = "desc", max, enabled = true }: CollectionOptions = {},
) {
  const [snap, setSnap] = useState<Snapshot<T> | null>(null);
  const active = enabled && isFirebaseConfigured;

  useEffect(() => {
    if (!active) return;
    const constraints: QueryConstraint[] = [];
    if (orderByField) constraints.push(orderBy(orderByField, direction));
    if (max) constraints.push(limitTo(max));

    return onSnapshot(
      query(collection(db, name), ...constraints),
      (result) =>
        setSnap({
          data: result.docs.map((d) => ({ ...d.data(), id: d.id }) as unknown as T),
          error: null,
        }),
      (err) => setSnap({ data: [], error: err.message }),
    );
  }, [active, name, orderByField, direction, max]);

  return {
    data: snap?.data ?? [],
    loading: active && snap === null,
    error: snap?.error ?? null,
  };
}

/** Live dealership settings, falling back to defaults until saved. */
export function useSettings() {
  const [settings, setSettings] = useState<DealershipSettings | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    return onSnapshot(
      doc(db, "settings", "dealership"),
      (result) =>
        setSettings({ ...DEFAULT_SETTINGS, ...(result.data() as Partial<DealershipSettings>) }),
      () => setSettings(DEFAULT_SETTINGS),
    );
  }, []);

  return settings ?? DEFAULT_SETTINGS;
}
