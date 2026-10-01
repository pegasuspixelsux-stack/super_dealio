import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-100">{title}</h1>
        {description && <p className="mt-2 text-slate-400">{description}</p>}
      </div>
      {action}
    </div>
  );
}
