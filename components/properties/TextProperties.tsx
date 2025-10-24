
"use client";

import { useState, useEffect } from "react";
import { useEditorStore } from "@/store/useEditorStore";

function rgbToHex(rgb: string) {
  if (rgb.startsWith("#")) return rgb;
  
  const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (!match) return "#000000"; 

  function toHex(c: number) {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }

  return "#" + toHex(Number(match[1])) + toHex(Number(match[2])) + toHex(Number(match[3]));
}


export function TextProperties() {
  const { selectedElement, updateSelectedElementStyle } = useEditorStore();

  const [content, setContent] = useState("");
  const [styles, setStyles] = useState({
    fontSize: "",
    color: "#000000",
    fontWeight: "",
  });

  useEffect(() => {
    if (selectedElement) {
      setContent(selectedElement.textContent || "");

      const computed = window.getComputedStyle(selectedElement);
      
      const fontSizeValue = computed.fontSize || "";
      
      setStyles({
        fontSize: fontSizeValue,
        color: rgbToHex(computed.color) || "#000000",
        fontWeight: computed.fontWeight || "400",
      });
    }
  }, [selectedElement]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    if (selectedElement) {
      selectedElement.textContent = newContent;
    }
  };

  const handleStyleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setStyles((prev) => ({ ...prev, [name]: value }));
    
    let finalValue = value;
    if (name === "fontSize" && value && !/[a-z%]/.test(value)) {
      finalValue = `${value}px`;
    }
    
    updateSelectedElementStyle(name, finalValue);
  };

  if (!selectedElement) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Text Properties</h3>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
          Text Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={handleContentChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Enter text here..."
        />
        <p className="mt-1 text-xs text-gray-500">
          Characters: {content.length}
        </p>
      </div>

      <div>
        <label htmlFor="fontSize" className="block text-sm font-medium text-gray-700">
          Font Size (e.g., 16px, 2rem)
        </label>
        <input
          type="text"
          name="fontSize"
          id="fontSize"
          value={styles.fontSize}
          onChange={handleStyleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          placeholder="16px"
        />
      </div>

      <div>
        <label htmlFor="color" className="block text-sm font-medium text-gray-700">
          Color
        </label>
        <input
          type="color"
          name="color"
          id="color"
          value={styles.color}
          onChange={handleStyleChange}
          className="mt-1 block w-full h-10 p-1 border border-gray-300 rounded-md cursor-pointer"
        />
      </div>

      <div>
        <label htmlFor="fontWeight" className="block text-sm font-medium text-gray-700">
          Font Weight
        </label>
        <select
          name="fontWeight"
          id="fontWeight"
          value={styles.fontWeight}
          onChange={handleStyleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        >
          <option value="">Default</option>
          <option value="100">100 (Thin)</option>
          <option value="200">200 (Extra Light)</option>
          <option value="300">300 (Light)</option>
          <option value="400">400 (Normal)</option>
          <option value="500">500 (Medium)</option>
          <option value="600">600 (Semi Bold)</option>
          <option value="700">700 (Bold)</option>
          <option value="800">800 (Extra Bold)</option>
          <option value="900">900 (Black)</option>
        </select>
      </div>

      <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
        <p className="text-xs text-gray-600 mb-2">Preview:</p>
        <div
          style={{
            fontSize: styles.fontSize || "16px",
            color: styles.color,
            fontWeight: styles.fontWeight || "normal",
          }}
          className="break-words"
        >
          {content || "(empty)"}
        </div>
      </div>
    </div>
  );
}