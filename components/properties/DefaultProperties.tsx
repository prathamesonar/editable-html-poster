"use client";

import { useEditorStore } from "@/store/useEditorStore";

export function DefaultProperties() {
  const { selectedElement } = useEditorStore();

  if (!selectedElement) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Element Properties</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tag Name
        </label>
        <input
          type="text"
          readOnly
          value={selectedElement.tagName}
          className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
        />
      </div>
    </div>
  );
}