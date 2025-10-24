
"use client";

import { useRef, useEffect } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import { SelectionOverlay } from "@/components/SelectionOverlay";


export function Stage() {
  const {
    bodyContent,
    styleContent,
    setStageRef,
    setSelectedElement,
    selectedElement,
  } = useEditorStore();

  const stageRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stageRef.current) {
      setStageRef(stageRef.current);
    }
  }, [setStageRef]);

  useEffect(() => {
    if (stageRef.current) {
      setSelectedElement(null);
      stageRef.current.innerHTML = bodyContent;
    }
  }, [bodyContent, setSelectedElement]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const target = e.target as HTMLElement;

    if (target === wrapperRef.current || target === stageRef.current) {
      setSelectedElement(null);
    } else if (stageRef.current?.contains(target)) {
      let el: HTMLElement | null = target;
      while (el && el.parentElement !== stageRef.current && el !== stageRef.current) {
        el = el.parentElement;
      }
      setSelectedElement(el);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (
      stageRef.current?.contains(target) &&
      ["P", "H1", "H2", "H3", "H4", "H5", "H6", "DIV", "SPAN", "STRONG"].includes(
        target.tagName
      )
    ) {
      setSelectedElement(null);

      target.contentEditable = "true";
      target.focus();

      window.getSelection()?.selectAllChildren(target);

      target.onblur = () => {
        target.contentEditable = "false";
        target.onblur = null;
        setSelectedElement(target);
      };
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styleContent }} />

      
      <div
        ref={wrapperRef}
        className="poster"
        style={{
          width: "720px",
          height: "720px",
          position: "relative",
          overflow: "hidden",
          background: "#f3f4f6",
          fontFamily: "sans-serif",
          margin: 0,
          padding: 0,
          boxSizing: "border-box",
          flexShrink: 0,
        }}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      >
        <div
          ref={stageRef}
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            margin: 0,
            padding: 0,
          }}
        >
        </div>

        {selectedElement && stageRef.current && (
          <SelectionOverlay stageRef={stageRef.current} />
        )}
      </div>
    </>
  );
}