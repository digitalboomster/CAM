"use client";

import { useState, useCallback } from "react";
import CitationPanel from "./CitationPanel";

export type CellStatus = "reading" | "snippet" | "no-answer";

export interface MatrixRow {
  id: string;
  documentName: string;
  date: string;
  documentType: string;
  cells: { status: CellStatus; text?: string; source?: string; docRef?: string }[];
}

const extractionColumns = ["Investment Risks", "Market Considerations"];

const mockRows: MatrixRow[] = [
  {
    id: "1",
    documentName: "FY2024 P&L",
    date: "Jan 18, 2024",
    documentType: "Financials",
    cells: [
      { status: "snippet", text: "There have been increasing costs related to supply chain and labor in the past two quarters.", source: "Page 4, FY2024 P&L: 'Operating expenses increased 12% YoY, driven primarily by supply chain and labor cost inflation.'", docRef: "FY2024 P&L" },
      { status: "no-answer" },
    ],
  },
  {
    id: "2",
    documentName: "Project Alpha CIM",
    date: "Apr 29, 2024",
    documentType: "Marketing Materials",
    cells: [
      { status: "snippet", text: "Risk factors that are not detailed in the CIM include regulatory changes in key markets.", source: "Section 8, Project Alpha CIM: 'The company operates in jurisdictions subject to evolving regulation; material changes could affect margins.'", docRef: "Project Alpha CIM" },
      { status: "snippet", text: "Despite the growing TAM described within the document, competitive intensity has increased.", source: "Section 3, Project Alpha CIM: 'While the addressable market is expanding, new entrants have intensified competition in the core segment.'", docRef: "Project Alpha CIM" },
    ],
  },
  {
    id: "3",
    documentName: "Board Deck Q3",
    date: "Sep 12, 2024",
    documentType: "Financials",
    cells: [
      { status: "reading" },
      { status: "reading" },
    ],
  },
];

export default function MatrixGrid() {
  const [rows, setRows] = useState<MatrixRow[]>(mockRows);
  const [citation, setCitation] = useState<{ source: string; docRef: string } | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);

  const handleCellClick = useCallback(
    (cell: MatrixRow["cells"][0], docName: string) => {
      if (cell.status === "no-answer") {
        setExplanation("This field was not found in the document. The model searched for market-related content but did not identify a direct statement; consider adding a follow-up column or checking another source.");
        setCitation(null);
      } else if (cell.source && cell.docRef) {
        setCitation({ source: cell.source, docRef: cell.docRef });
        setExplanation(null);
      }
    },
    []
  );

  const closePanel = useCallback(() => {
    setCitation(null);
    setExplanation(null);
  }, []);

  const columns = ["Document", "Date", "Document Type", ...extractionColumns];

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-end gap-2 px-4 py-2 border-b border-gray-100 bg-gray-50/50">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-gray-700 hover:bg-white border border-gray-200">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Display
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-gray-700 hover:bg-white border border-gray-200">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Add documents
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-gray-700 hover:bg-white border border-gray-200">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Add columns
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80">
                <th className="w-10 px-3 py-2.5 text-left">
                  <input type="checkbox" className="rounded border-gray-300 text-nautilus-blue focus:ring-nautilus-blue" />
                </th>
                <th className="w-8 px-2 py-2.5 text-left text-gray-500 font-medium">#</th>
                <th className="w-8 px-2 py-2.5" aria-label="Drag" />
                <th className="px-3 py-2.5 text-left font-medium text-gray-700">
                  <span className="flex items-center gap-1">
                    Document
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </span>
                </th>
                <th className="px-3 py-2.5 text-left font-medium text-gray-700">
                  <span className="flex items-center gap-1">
                    Date
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </span>
                </th>
                <th className="px-3 py-2.5 text-left font-medium text-gray-700">
                  <span className="flex items-center gap-1">
                    Document Type
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </span>
                </th>
                {extractionColumns.map((col) => (
                  <th key={col} className="px-3 py-2.5 text-left font-medium text-gray-700 min-w-[180px]">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                  <td className="px-3 py-2">
                    <input type="checkbox" className="rounded border-gray-300 text-nautilus-blue focus:ring-nautilus-blue" />
                  </td>
                  <td className="px-2 py-2 text-gray-500">{idx + 1}</td>
                  <td className="px-2 py-2 text-gray-400 cursor-grab">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 6h2v2H8V6zm0 5h2v2H8v-2zm0 5h2v2H8v-2zm5-10h2v2h-2V6zm0 5h2v2h-2v-2zm0 5h2v2h-2v-2z" />
                    </svg>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-800">{row.documentName}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-gray-600">{row.date}</td>
                  <td className="px-3 py-2">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-nautilus-pill text-nautilus-pill-text">
                      {row.documentType}
                    </span>
                  </td>
                  {row.cells.map((cell, cellIdx) => (
                    <td
                      key={cellIdx}
                      className="px-3 py-2 max-w-[280px] cursor-pointer hover:bg-nautilus-blue-light/30 rounded"
                      onClick={() => handleCellClick(cell, row.documentName)}
                    >
                      {cell.status === "reading" && (
                        <span className="text-gray-400 italic">Reading…</span>
                      )}
                      {cell.status === "snippet" && (
                        <span className="text-gray-700 line-clamp-2">{cell.text}</span>
                      )}
                      {cell.status === "no-answer" && (
                        <span className="text-gray-500 text-xs italic">Not in document, click to view explanation</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add row */}
        <div className="border-t border-gray-100 px-4 py-2 bg-gray-50/30">
          <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-nautilus-blue">
            <span className="flex items-center justify-center w-6 h-6 rounded border border-dashed border-gray-300">+</span>
            Add row
          </button>
        </div>
      </div>

      <CitationPanel
        citation={citation}
        explanation={explanation}
        onClose={closePanel}
      />
    </>
  );
}
