"use client";

import { useEffect } from "react";
import { loadAndApplyTheme } from "@/lib/settings";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    loadAndApplyTheme();
  }, []);
  return <>{children}</>;
}
