import Link from "next/link";

const columns = [
  {
    title: "Browse",
    links: [
      { label: "All vehicles", href: "/#inventory" },
      { label: "SUVs", href: "/?type=SUV#inventory" },
      { label: "Sedans", href: "/?type=Sedan#inventory" },
      { label: "Trucks", href: "/?type=Truck#inventory" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/" },
      { label: "Financing", href: "/" },
      { label: "Contact", href: "/" },
    ],
  },
  {
    title: "Team",
    links: [
      { label: "Staff login", href: "/login" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-[2fr_1fr_1fr_1fr]">
        <div>
          <p className="text-lg font-bold tracking-tight text-slate-100">
            Super<span className="text-slate-500">Dealio</span>
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
            Exceptional vehicles, transparent pricing and a buying experience that respects your
            time.
          </p>
        </div>
        {columns.map((column) => (
          <div key={column.title}>
            <h3 className="text-sm font-semibold text-slate-100">{column.title}</h3>
            <ul className="mt-4 space-y-3">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors duration-200 hover:text-slate-100"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-800/80 px-6 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} SuperDealio. All rights reserved.
      </div>
    </footer>
  );
}
