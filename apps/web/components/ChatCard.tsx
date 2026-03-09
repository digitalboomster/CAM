"use client";

import { useState } from "react";

const sampleReply = [
  "What were the main drivers of the cost increase in FY2024, and how does management plan to address them?",
  "How does Project Alpha compare to the initial CIM assumptions in terms of revenue and margin trajectory?",
  "What key risks does management consider most material that are not already covered in the CIM?",
  "Can you walk through the timeline and milestones for the product roadmap mentioned in the materials?",
  "What is the current run rate for customer concentration and what mitigation is in place?",
];

export default function ChatCard() {
  const [stepsExpanded, setStepsExpanded] = useState(false);
  const [input, setInput] = useState("");

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="p-5 space-y-5">
        {/* User */}
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0 flex items-center justify-center text-sm font-medium text-gray-600">
            U
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 mb-1">You</p>
            <p className="text-sm text-gray-800">
              We are meeting the management team of Project Alpha tomorrow. Draft some key DD questions based on your assessment of these documents.
            </p>
          </div>
        </div>

        {/* Agent */}
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-lg bg-nautilus-blue shrink-0 flex items-center justify-center text-white font-bold text-sm">
            i
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-nautilus-blue mb-1">Matrix Agent</p>
            <button
              onClick={() => setStepsExpanded((e) => !e)}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 mb-2"
            >
              <span>12 steps completed</span>
              <svg
                className={`w-4 h-4 transition-transform ${stepsExpanded ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {stepsExpanded && (
              <div className="mb-3 text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
                Step 1: Read documents · Step 2: Extract risks · Step 3: Extract market context · …
              </div>
            )}
            <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-3">
              <p className="text-xs font-semibold text-gray-700 mb-2">Key Questions for Meeting with Project Alpha</p>
              <ol className="list-decimal list-inside space-y-1.5 text-sm text-gray-700">
                {sampleReply.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 p-3">
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-nautilus-blue/20 focus-within:border-nautilus-blue">
          <button className="p-1 text-gray-400 hover:text-gray-600" aria-label="Upload">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            className="flex-1 min-w-0 bg-transparent text-sm outline-none placeholder:text-gray-400"
          />
          <button className="p-1 text-gray-400 hover:text-nautilus-blue" aria-label="Send">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
