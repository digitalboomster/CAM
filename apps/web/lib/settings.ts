const STORAGE_KEY = "nautilus.settings.v1";
const THEME_KEY = "nautilus.theme";

export type DefaultExportFormat = "pdf" | "excel";
export type Theme = "light" | "dark";

export interface AppSettings {
  defaultExportFormat: DefaultExportFormat;
  requireCitationsOnExport: boolean;
  theme: Theme;
}

const defaults: AppSettings = {
  defaultExportFormat: "pdf",
  requireCitationsOnExport: true,
  theme: "light",
};

export function loadSettings(): AppSettings {
  if (typeof window === "undefined") return defaults;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<AppSettings>) : {};
    const theme = (localStorage.getItem(THEME_KEY) as Theme | null) ?? parsed.theme ?? defaults.theme;
    return {
      defaultExportFormat: parsed.defaultExportFormat ?? defaults.defaultExportFormat,
      requireCitationsOnExport: parsed.requireCitationsOnExport ?? defaults.requireCitationsOnExport,
      theme,
    };
  } catch {
    return defaults;
  }
}

export function saveSettings(settings: AppSettings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    localStorage.setItem(THEME_KEY, settings.theme);
    applyTheme(settings.theme);
  } catch {}
}

export function applyTheme(theme: Theme): void {
  if (typeof document === "undefined") return;
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export function loadAndApplyTheme(): void {
  if (typeof window === "undefined") return;
  try {
    const stored = localStorage.getItem(THEME_KEY) as Theme | null;
    const theme = stored ?? "light";
    applyTheme(theme);
  } catch {}
}
