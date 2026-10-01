"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, CarFront } from "lucide-react";
import { Badge, Card, CardHeader, EmptyState } from "@/components/ui/card";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { leadTone } from "@/components/dashboard/status";
import { useCollection, useSettings } from "@/lib/firestore";
import type { Car, Lead } from "@/lib/types";
import { cn, formatCurrency, formatNumber, monthRange, percentChange, timeAgo } from "@/lib/utils";

interface Kpi {
  label: string;
  value: string;
  change: number | null;
}

function inRange(value: number | null | undefined, range: { start: number; end: number }) {
  return value != null && value >= range.start && value < range.end;
}

export default function ControlPanelPage() {
  const { data: cars, loading: carsLoading } = useCollection<Car>("cars", { orderByField: "createdAt" });
  const { data: leads, loading: leadsLoading } = useCollection<Lead>("leads", {
    orderByField: "createdAt",
  });
  const { currency } = useSettings();

  const kpis = useMemo<Kpi[]>(() => {
    const thisMonth = monthRange(0);
    const lastMonth = monthRange(-1);

    const revenue = (range: { start: number; end: number }) =>
      cars.filter((car) => inRange(car.soldAt, range)).reduce((sum, car) => sum + car.price, 0);
    const conversion = (range: { start: number; end: number }) => {
      const created = leads.filter((lead) => inRange(lead.createdAt, range));
      return created.length
        ? (created.filter((lead) => lead.status === "converted").length / created.length) * 100
        : 0;
    };
    const count = <T extends { createdAt: number }>(items: T[], range: { start: number; end: number }) =>
      items.filter((item) => inRange(item.createdAt, range)).length;

    const overallConversion = leads.length
      ? (leads.filter((lead) => lead.status === "converted").length / leads.length) * 100
      : 0;

    return [
      {
        label: "Total inventory",
        value: formatNumber(cars.filter((car) => car.status !== "sold").length),
        change: percentChange(count(cars, thisMonth), count(cars, lastMonth)),
      },
      {
        label: "Active leads",
        value: formatNumber(leads.filter((lead) => lead.status !== "converted").length),
        change: percentChange(count(leads, thisMonth), count(leads, lastMonth)),
      },
      {
        label: "Monthly revenue",
        value: formatCurrency(revenue(thisMonth), currency),
        change: percentChange(revenue(thisMonth), revenue(lastMonth)),
      },
      {
        label: "Conversion rate",
        value: `${overallConversion.toFixed(1)}%`,
        change: percentChange(conversion(thisMonth), conversion(lastMonth)),
      },
    ];
  }, [cars, leads, currency]);

  const latestCars = cars.slice(0, 5);
  const latestLeads = leads.slice(0, 5);

  return (
    <>
      <PageHeader title="Control Panel" description="A live overview of your dealership." />

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi, index) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card className="p-6">
              <p className="text-sm font-medium text-slate-400">{kpi.label}</p>
              <p className="mt-3 text-4xl font-bold tracking-tight text-slate-100">
                {carsLoading || leadsLoading ? "–" : kpi.value}
              </p>
              <Change value={kpi.change} />
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Latest cars entered" description="Recently added inventory" />
          {latestCars.length === 0 ? (
            <EmptyState>{carsLoading ? "Loading…" : "No vehicles yet."}</EmptyState>
          ) : (
            <ul className="divide-y divide-slate-800/80">
              {latestCars.map((car) => (
                <li key={car.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-800/60 text-slate-600">
                    {car.images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={car.images[0]} alt="" className="size-full object-cover" />
                    ) : (
                      <CarFront className="size-5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-100">
                      {car.year} {car.make} {car.model}
                    </p>
                    <p className="text-sm text-slate-500">{timeAgo(car.createdAt)}</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-100">
                    {formatCurrency(car.price, currency)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader title="Latest leads" description="Incoming customer inquiries" />
          {latestLeads.length === 0 ? (
            <EmptyState>{leadsLoading ? "Loading…" : "No leads yet."}</EmptyState>
          ) : (
            <ul className="divide-y divide-slate-800/80">
              {latestLeads.map((lead) => (
                <li key={lead.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-100">{lead.name}</p>
                    <p className="truncate text-sm text-slate-500">
                      {lead.carLabel || "General inquiry"} · {timeAgo(lead.createdAt)}
                    </p>
                  </div>
                  <Badge tone={leadTone[lead.status]} className="capitalize">
                    {lead.status}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}

function Change({ value }: { value: number | null }) {
  if (value === null) {
    return <p className="mt-3 text-sm text-slate-500">New this month</p>;
  }
  const up = value >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <p
      className={cn(
        "mt-3 inline-flex items-center gap-1 text-sm font-medium",
        value === 0 ? "text-slate-500" : up ? "text-emerald-400" : "text-red-400",
      )}
    >
      <Icon className="size-4" />
      {Math.abs(value).toFixed(1)}%
      <span className="font-normal text-slate-500">vs last month</span>
    </p>
  );
}
