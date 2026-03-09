"use client";

import type { ModuleIconName } from "@/lib/types";

/** SVG icons for modules and report types — no emojis. All 24×24, stroke 2. */
const stroke = { strokeLinecap: "round" as const, strokeLinejoin: "round" as const, strokeWidth: 2 };

interface ModuleIconProps {
  name: ModuleIconName;
  className?: string;
}

export function ModuleIcon({ name, className = "w-6 h-6" }: ModuleIconProps) {
  const p = { fill: "none" as const, stroke: "currentColor", viewBox: "0 0 24 24", ...stroke };
  const c = className;

  switch (name) {
    case "document":
      return (
        <svg className={c} {...p}>
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    case "chart":
      return (
        <svg className={c} {...p}>
          <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
    case "lightning":
      return (
        <svg className={c} {...p}>
          <path d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    case "scale":
      return (
        <svg className={c} {...p}>
          <path d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      );
    case "diamond":
      return (
        <svg className={c} {...p}>
          <path d="M12 2L2 9l10 13 10-13L12 2z" />
        </svg>
      );
    case "globe":
      return (
        <svg className={c} {...p}>
          <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0h.5a2.5 2.5 0 002.5-2.5V3.935M12 12a8 8 0 11-16 0 8 8 0 0116 0z" />
        </svg>
      );
    case "building":
      return (
        <svg className={c} {...p}>
          <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      );
    case "refresh":
      return (
        <svg className={c} {...p}>
          <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      );
    case "check":
      return (
        <svg className={c} {...p}>
          <path d="M5 13l4 4L19 7" />
        </svg>
      );
    case "folder":
      return (
        <svg className={c} {...p}>
          <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      );
    case "clipboard":
      return (
        <svg className={c} {...p}>
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      );
    case "search":
      return (
        <svg className={c} {...p}>
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      );
    case "box":
      return (
        <svg className={c} {...p}>
          <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      );
    case "export":
      return (
        <svg className={c} {...p}>
          <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      );
    case "upload":
      return (
        <svg className={c} {...p}>
          <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      );
    case "robot":
      return (
        <svg className={c} {...p}>
          <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    default:
      return (
        <svg className={c} {...p}>
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      );
  }
}
