"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const categories = [
  { label: "All", href: "/#inventory" },
  { label: "SUVs", href: "/?type=SUV#inventory" },
  { label: "Sedans", href: "/?type=Sedan#inventory" },
  { label: "Trucks", href: "/?type=Truck#inventory" },
  { label: "Coupes", href: "/?type=Coupe#inventory" },
];

export function Navbar() {
  const focusSearch = () => {
    const input = document.getElementById("search-input");
    input?.scrollIntoView({ behavior: "smooth", block: "center" });
    input?.focus({ preventScroll: true });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-6">
        <Link href="/" className="text-lg font-bold tracking-tight text-slate-100">
          Super<span className="text-slate-500">Dealio</span>
        </Link>

        <nav aria-label="Categories" className="hidden items-center gap-1 md:flex">
          {categories.map((category) => (
            <Link
              key={category.label}
              href={category.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-colors duration-200 hover:bg-white/5 hover:text-slate-100"
            >
              {category.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={focusSearch}
            aria-label="Search vehicles"
            className={cn(
              "rounded-xl p-2.5 text-slate-400 transition-[background-color,color,transform] duration-200",
              "hover:bg-white/5 hover:text-slate-100 active:scale-[0.95]",
            )}
          >
            <Search className="size-5" />
          </button>
          <Link href="/login" className={buttonStyles("primary", "sm")}>
            Log in
          </Link>
        </div>
      </div>
    </header>
  );
}
