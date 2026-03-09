"use client";

import { useState, useRef } from "react";

interface UploadSourcesModalProps {
  onClose: () => void;
  onUpload: (files: { name: string; date: string; type: string }[]) => void;
}

export default function UploadSourcesModal({ onClose, onUpload }: UploadSourcesModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files ? Array.from(e.target.files) : [];
    setFiles(list);
  };

  const handleUpload = () => {
    if (files.length === 0) return;
    setUploading(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if ((p ?? 0) >= 100) {
          clearInterval(interval);
          setUploading(false);
          const today = new Date().toISOString().slice(0, 10);
          onUpload(
            files.map((f) => ({
              name: f.name.replace(/\.[^/.]+$/, "") || f.name,
              date: today,
              type: "Document",
            }))
          );
          onClose();
          return 100;
        }
        return (p ?? 0) + 25;
      });
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <h3 className="font-semibold text-slate-900">Upload sources</h3>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100" aria-label="Close">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-4 space-y-4">
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.xlsx,.xls,.txt"
            onChange={handleSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full border-2 border-dashed border-slate-200 rounded-lg py-8 text-slate-500 hover:border-nautilus-teal hover:text-nautilus-teal transition-colors"
          >
            {files.length === 0 ? "Choose files or drag here" : `${files.length} file(s) selected`}
          </button>
          {progress !== null && (
            <div className="space-y-1">
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-nautilus-teal transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs text-slate-500">{uploading ? "Indexing and extracting…" : "Done."}</p>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 px-4 py-3 border-t border-slate-100">
          <button onClick={onClose} className="px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100">Cancel</button>
          <button
            onClick={handleUpload}
            disabled={files.length === 0 || uploading}
            className="px-3 py-2 rounded-lg text-sm bg-nautilus-teal text-white hover:bg-nautilus-teal-dark disabled:opacity-50 disabled:pointer-events-none"
          >
            {uploading ? "Uploading…" : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}
