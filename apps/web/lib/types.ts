export type CellStatus = "reading" | "snippet" | "no-answer";

export interface WorkspaceCell {
  status: CellStatus;
  text?: string;
  source?: string;
  docRef?: string;
  stepId?: number;
}

/** Document tree category for sources */
export const SOURCE_CATEGORIES = ["Financials", "Legal", "Regulatory", "Other"] as const;
export type SourceCategory = (typeof SOURCE_CATEGORIES)[number];

export interface WorkspaceRow {
  id: string;
  documentName: string;
  date: string;
  documentType: string;
  category: SourceCategory;
  cells: WorkspaceCell[];
}

export interface Project {
  id: string;
  name: string;
  fundId?: string | null;
  createdAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  projectId?: string | null;
  project?: { id: string; name: string } | null;
  createdAt: string;
}

export interface WorkspaceGridData {
  rows: WorkspaceRow[];
  extractionColumns: string[];
}

export interface ExportLogEntry {
  id: string;
  at: string;
  label: string;
  workspaceId?: string;
  exportedBy?: string;
  createdAt?: string;
}

export interface ViewOptions {
  hiddenColumnIds: Set<string>;
  density: "compact" | "comfortable";
}

/** Co-Pilot step list for auditability (trust layer) */
export const CO_PILOT_STEPS = [
  "Parse and index uploaded sources",
  "Identify document types and metadata",
  "Extract key risks from each source",
  "Extract valuation-related content",
  "Extract management commentary and themes",
  "Cross-reference risks across sources",
  "Cross-reference valuation inputs",
  "Synthesize management themes",
  "Generate DD question list",
  "Map questions to source citations",
  "Format structured output",
  "Write response to workspace",
] as const;

/** Default columns for DD / IC memo wedge */
export const DEFAULT_DD_COLUMNS = [
  "Key risks",
  "Valuation inputs",
  "Management themes",
  "Revenue & financials",
  "Regulatory & compliance",
  "Comparable precedents",
];
