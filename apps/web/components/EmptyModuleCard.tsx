"use client";

import Link from "next/link";

interface EmptyModuleCardProps {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export default function EmptyModuleCard({
  title,
  description,
  ctaLabel = "Go to Dashboard",
  ctaHref = "/dashboard",
}: EmptyModuleCardProps) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-8 text-center max-w-md mx-auto">
      <h3 className="font-semibold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-600 mt-2">{description}</p>
      <Link
        href={ctaHref}
        className="mt-4 inline-block px-4 py-2 rounded-lg text-sm font-medium bg-teal-600 text-white hover:bg-teal-700"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
