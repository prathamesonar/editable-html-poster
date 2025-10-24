"use client";

import { useEditorStore } from "@/store/useEditorStore";
import { DefaultProperties } from "@/components/properties/DefaultProperties";
import { ImageProperties } from "@/components/properties/ImageProperties";
import { TextProperties } from "@/components/properties/TextProperties";

export function PropertiesPanel() {
  const { selectedElement } = useEditorStore();

  if (!selectedElement) {
    return (
      <div className="text-sm text-gray-500">
        Select an element to edit its properties.
      </div>
    );
  }

  const tagName = selectedElement.tagName;

  switch (tagName) {
    case "IMG":
      return <ImageProperties />;
    case "P":
    case "H1":
    case "H2":
    case "H3":
    case "H4":
    case "H5":
    case "H6":
    case "DIV":
    case "SPAN":
    case "STRONG":
      return <TextProperties />;
    default:
      return <DefaultProperties />;
  }
}