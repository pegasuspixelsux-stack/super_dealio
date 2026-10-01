import type { CarStatus, LeadStatus } from "@/lib/types";

export const leadTone = {
  new: "blue",
  contacted: "amber",
  converted: "green",
} as const satisfies Record<LeadStatus, string>;

export const carTone = {
  available: "green",
  reserved: "amber",
  sold: "neutral",
} as const satisfies Record<CarStatus, string>;
