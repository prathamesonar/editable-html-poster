"use client";

import { useState, useEffect, useRef } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { useEditorStore } from "@/store/useEditorStore";

interface SelectionOverlayProps {
  stageRef: HTMLDivElement;
}

export function SelectionOverlay({ stageRef }: SelectionOverlayProps) {
  const { selectedElement, updateSelectedElementStyle } = useEditorStore();
  const [bounds, setBounds] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const nodeRef = useRef(null);

  useEffect(() => {
    if (!selectedElement) return;

    const stageRect = stageRef.getBoundingClientRect();
    const elemRect = selectedElement.getBoundingClientRect();

    const newBounds = {
      top: elemRect.top - stageRect.top,
      left: elemRect.left - stageRect.left,
      width: elemRect.width,
      height: elemRect.height,
    };

    setBounds(newBounds);
   
    const elemStyle = window.getComputedStyle(selectedElement);
    const elemTop = parseFloat(elemStyle.top) || newBounds.top;
    const elemLeft = parseFloat(elemStyle.left) || newBounds.left;
    
    setPosition({ x: elemLeft, y: elemTop });
    
  }, [selectedElement, stageRef]);

  const handleDragStop = (e: DraggableEvent, data: DraggableData) => {
    if (!selectedElement) return;

    const newTop = data.y;
    const newLeft = data.x;

    updateSelectedElementStyle("position", "absolute");
    updateSelectedElementStyle("top", `${newTop}px`);
    updateSelectedElementStyle("left", `${newLeft}px`);

    setPosition({ x: newLeft, y: newTop });
  };
  
  const handleDrag = (e: DraggableEvent, data: DraggableData) => {
    if (!selectedElement) return;
    
    selectedElement.style.position = "absolute";
    selectedElement.style.top = `${data.y}px`;
    selectedElement.style.left = `${data.x}px`;
    setPosition({ x: data.x, y: data.y });
  };

  if (!selectedElement) return null;
  
  const stageRect = stageRef.getBoundingClientRect();

  return (
    <Draggable
      nodeRef={nodeRef}
      position={position}
      onStop={handleDragStop}
      onDrag={handleDrag}
      bounds="parent" 
    >
      <div
        ref={nodeRef}
        style={{
          width: bounds.width,
          height: bounds.height,
          position: 'absolute', 
          top: 0, 
          left: 0,
        }}
        className="border-2 border-blue-500 cursor-move z-10 box-content"
      >
        <div className="w-full h-full pointer-events-none"></div>
      </div>
    </Draggable>
  );
}