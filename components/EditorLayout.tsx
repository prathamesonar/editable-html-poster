
"use client";

import { useEffect, useState } from "react";
import { Toolbar } from "@/components/Toolbar";
import { Stage } from "@/components/Stage";
import { PropertiesPanel } from "@/components/PropertiesPanel";
import { useEditorStore } from "@/store/useEditorStore";


export function EditorLayout() {
  const { deleteSelectedElement, selectedElement } = useEditorStore();
  const [elementInfo, setElementInfo] = useState<string>("");

  useEffect(() => {
    if (selectedElement) {
      const tagName = selectedElement.tagName.toLowerCase();
      const className = selectedElement.className
        ? `.${selectedElement.className.split(" ").join(".")}`
        : "";
      const id = selectedElement.id ? `#${selectedElement.id}` : "";
      const selector = `${tagName}${id}${className}`;
      setElementInfo(selector);
    } else {
      setElementInfo("");
    }
  }, [selectedElement]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (
        activeEl?.tagName === "INPUT" ||
        activeEl?.tagName === "TEXTAREA" ||
        (activeEl as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedElement) {
          e.preventDefault();
          if (window.confirm("Are you sure you want to delete this element?")) {
            deleteSelectedElement();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedElement, deleteSelectedElement]);

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-50">
      <Toolbar />

      <div className="flex flex-1 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex items-center justify-center overflow-auto p-8">
            <div className="rounded-xl shadow-2xl overflow-hidden flex-shrink-0">
              <Stage />
            </div>
          </div>

          <div className="border-t border-gray-200 bg-white px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Element
                </span>
                <code className="text-sm font-mono text-gray-700 bg-gray-100 px-3 py-1 rounded">
                  {elementInfo || "None selected"}
                </code>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Dimensions: 720 × 720px
            </div>
          </div>
        </div>

        <aside className="w-80 bg-white border-l border-gray-200 shadow-lg flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <PropertiesPanel />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}