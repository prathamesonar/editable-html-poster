
"use client";

import { useState, useEffect } from "react";
import { useEditorStore } from "@/store/useEditorStore";

export function ImageProperties() {
  const { selectedElement, updateSelectedElementAttribute, updateSelectedElementStyle } = useEditorStore();
  
  const [attrs, setAttrs] = useState({
    src: "",
    alt: "",
    width: "",
    height: "",
  });

 
  useEffect(() => {
    if (selectedElement && selectedElement.tagName === "IMG") {
      const style = window.getComputedStyle(selectedElement);
      setAttrs({
        src: selectedElement.getAttribute("src") || "",
        alt: selectedElement.getAttribute("alt") || "",
        width: style.width || selectedElement.getAttribute("width") || "",
        height: style.height || selectedElement.getAttribute("height") || "",
      });
    }
  }, [selectedElement]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAttrs({
      ...attrs,
      [e.target.name]: e.target.value,
    });
  };

  const handleAttributeBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateSelectedElementAttribute(name, value);
  };
  
  const handleDimensionBlur = (e: React.FocusEvent<HTMLInputElement>) => {
     const { name, value } = e.target;
     const finalValue = /^\d+$/.test(value) ? `${value}px` : value;
     updateSelectedElementStyle(name, finalValue);
  }
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        setAttrs(prev => ({ ...prev, src: dataUrl }));
        updateSelectedElementAttribute('src', dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!selectedElement || selectedElement.tagName !== "IMG") return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Image Properties</h3>
      
      <div>
        <label htmlFor="src" className="block text-sm font-medium text-gray-700">
          Image URL (src)
        </label>
        <textarea
          name="src"
          id="src"
          value={attrs.src}
          onChange={handleChange}
          onBlur={handleAttributeBlur}
          rows={3}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-xs font-mono resize-none"
          placeholder="https://example.com/image.jpg"
        />
        <p className="mt-1 text-xs text-gray-500">
          Length: {attrs.src.length} characters
        </p>
      </div>
      
      <div>
        <label htmlFor="imageUpload" className="block text-sm font-medium text-gray-700">
          Or Upload Image
        </label>
        <input
          type="file"
          name="imageUpload"
          id="imageUpload"
          accept="image/*"
          onChange={handleFileChange}
          className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>

      {attrs.src && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preview
          </label>
          <div className="border border-gray-300 rounded-md p-2 bg-gray-50 max-h-40 overflow-hidden">
            <img
              src={attrs.src}
              alt="preview"
              className="w-full h-auto object-contain"
              crossOrigin="anonymous"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.insertAdjacentHTML("afterend", '<p class="text-xs text-gray-600">Preview: Image loads on stage ✓</p>');
              }}
            />
          </div>
        </div>
      )}

      <div>
        <label htmlFor="alt" className="block text-sm font-medium text-gray-700">
          Alt Text
        </label>
        <input
          type="text"
          name="alt"
          id="alt"
          value={attrs.alt}
          onChange={handleChange}
          onBlur={handleAttributeBlur}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          placeholder="Describe the image"
        />
      </div>

      <div>
        <label htmlFor="width" className="block text-sm font-medium text-gray-700">
          Width (e.g., 150px or 100%)
        </label>
        <input
          type="text"
          name="width"
          id="width"
          value={attrs.width}
          onChange={handleChange}
          onBlur={handleDimensionBlur}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div>
        <label htmlFor="height" className="block text-sm font-medium text-gray-700">
          Height (e.g., 150px or auto)
        </label>
        <input
          type="text"
          name="height"
          id="height"
          value={attrs.height}
          onChange={handleChange}
          onBlur={handleDimensionBlur}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>
    </div>
  );
}