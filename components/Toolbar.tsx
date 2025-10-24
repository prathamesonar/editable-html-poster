"use client";

import { useRef, useState } from "react";
import {
  Upload,
  Download,
  Trash2,
  Type,
  Image as ImageIcon,
  FileCode,
  X,
} from "lucide-react";
import { useEditorStore } from "@/store/useEditorStore";
import { exportHtml } from "@/lib/dom-utils";

export function Toolbar() {
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [pasteHtml, setPasteHtml] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    setRawHtml,
    stageRef,
    styleContent,
    deleteSelectedElement,
    addElement,
    selectedElement,
  } = useEditorStore();

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const htmlContent = ev.target?.result as string;
        setRawHtml(htmlContent);
      };
      reader.readAsText(file);
    }
    e.target.value = "";
  };

  const handlePasteSubmit = () => {
    if (pasteHtml.trim()) {
      setRawHtml(pasteHtml);
      setShowPasteModal(false);
      setPasteHtml("");
    }
  };

  const handleExport = () => {
    if (stageRef) {
      exportHtml(stageRef, styleContent);
    }
  };

  const handleDelete = () => {
    if (selectedElement) {
      if (window.confirm("Are you sure you want to delete this element?")) {
        deleteSelectedElement();
      }
    }
  };

  return (
    <>
      <header className="w-full bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg border-b border-slate-700">
        <div className="px-6 py-4 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
              <FileCode size={18} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">HTML Poster Editor</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-700/40 rounded-lg p-1">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 active:bg-blue-800 transition-all duration-150 font-medium"
                title="Import HTML file"
              >
                <Upload size={16} /> Import
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileImport}
                className="hidden"
                accept=".html"
              />

              <button
                onClick={() => setShowPasteModal(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-slate-600 text-white rounded-md hover:bg-slate-700 active:bg-slate-800 transition-all duration-150 font-medium"
                title="Paste HTML content"
              >
                <FileCode size={16} /> Paste
              </button>
            </div>

            <div className="h-6 w-px bg-slate-600"></div>

            <div className="flex items-center gap-2 bg-slate-700/40 rounded-lg p-1">
              <button
                onClick={() => addElement("text")}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-emerald-600 text-white rounded-md hover:bg-emerald-700 active:bg-emerald-800 transition-all duration-150 font-medium"
                title="Add text element"
              >
                <Type size={16} /> Text
              </button>
              <button
                onClick={() => addElement("image")}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-emerald-600 text-white rounded-md hover:bg-emerald-700 active:bg-emerald-800 transition-all duration-150 font-medium"
                title="Add image element"
              >
                <ImageIcon size={16} /> Image
              </button>
            </div>

            <div className="h-6 w-px bg-slate-600"></div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDelete}
                disabled={!selectedElement}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 active:bg-red-800 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-150 font-medium"
                title={selectedElement ? "Delete selected element" : "Select an element first"}
              >
                <Trash2 size={16} /> Delete
              </button>

              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 active:bg-purple-800 transition-all duration-150 font-medium"
                title="Export as HTML file"
              >
                <Download size={16} /> Export
              </button>
            </div>
          </div>
        </div>
      </header>

      {showPasteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl animate-slide-in">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Paste HTML Content</h3>
                <p className="text-sm text-gray-500 mt-1">Paste your complete HTML code below</p>
              </div>
              <button
                onClick={() => setShowPasteModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <textarea
                className="w-full h-80 p-4 border border-gray-300 rounded-lg font-mono text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none"
                value={pasteHtml}
                onChange={(e) => setPasteHtml(e.target.value)}
                placeholder="<!DOCTYPE html>&#10;<html>&#10;  <head>&#10;    ...&#10;  </head>&#10;  <body>&#10;    ...&#10;  </body>&#10;</html>"
                spellCheck="false"
              />
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-xl">
              <button
                onClick={() => setShowPasteModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePasteSubmit}
                disabled={!pasteHtml.trim()}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Load HTML
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}