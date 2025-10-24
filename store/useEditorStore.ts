
import { create } from "zustand";
import DOMPurify from "dompurify";

interface EditorState {
  rawHtml: string;
  bodyContent: string;
  styleContent: string;
  selectedElement: HTMLElement | null;
  stageRef: HTMLDivElement | null;
}

interface EditorActions {
  setRawHtml: (html: string) => void;
  setSelectedElement: (element: HTMLElement | null) => void;
  setStageRef: (ref: HTMLDivElement | null) => void;
  updateSelectedElementStyle: (property: string, value: string) => void;
  updateSelectedElementAttribute: (attr: string, value: string) => void;
  deleteSelectedElement: () => void;
  addElement: (type: "text" | "image") => void;
}

const parseAndSanitizeHtml = (html: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const styleTag = doc.querySelector("style");
  const styleContent = styleTag ? styleTag.innerHTML : "";

  const posterDiv = doc.querySelector(".poster");
  
  let bodyContent = "";
  if (posterDiv) {
    bodyContent = posterDiv.innerHTML;
  } else {
    bodyContent = doc.body.innerHTML;
  }

  const sanitizedBody = DOMPurify.sanitize(bodyContent, {
    USE_PROFILES: { html: true },
    ADD_TAGS: ["strong"],
    ADD_ATTR: ["class", "style"],
  });

  return { bodyContent: sanitizedBody, styleContent };
};

export const useEditorStore = create<EditorState & EditorActions>((set, get) => ({
  rawHtml: "",
  bodyContent: `<h1 style="position: absolute; top: 120px; left: 40px; font-size: 42px; font-weight: bold; color: #1f2937; margin: 0; line-height: 1.2;">Welcome to<br/>HTML Poster<br/>Editor</h1><p style="position: absolute; top: 290px; left: 40px; font-size: 16px; color: #6b7280; margin: 0; max-width: 450px;">📤 Import a file or paste HTML code to get started with editing your poster</p><div style="position: absolute; top: 370px; left: 40px; font-size: 14px; color: #9ca3af; line-height: 1.8;"><p style="margin: 0; font-weight: 600; color: #6b7280;">✨ Key Features:</p><p style="margin: 8px 0 0 0;">• Import & edit HTML files</p><p style="margin: 4px 0 0 0;">• Drag & drop elements freely</p><p style="margin: 4px 0 0 0;">• Edit text, colors & font sizes</p><p style="margin: 4px 0 0 0;">• Add images & text blocks</p><p style="margin: 4px 0 0 0;">• Export your designs</p></div>`,
  styleContent: "",
  selectedElement: null,
  stageRef: null,

  setStageRef: (ref) => set({ stageRef: ref }),

  setSelectedElement: (element) => {
    const previousElement = get().selectedElement;
    
    if (previousElement && document.contains(previousElement)) {
      previousElement.classList.remove("selected-element-outline");
    }
    
    if (element && document.contains(element)) {
      element.classList.add("selected-element-outline");
    }
    
    set({ selectedElement: element });
  },

  setRawHtml: (html) => {
    const { bodyContent, styleContent } = parseAndSanitizeHtml(html);
    set({
      rawHtml: html,
      bodyContent,
      styleContent,
      selectedElement: null,
    });
  },

  updateSelectedElementStyle: (property, value) => {
    set((state) => {
      if (state.selectedElement) {
        
        const cssProperty = property
          .replace(/([A-Z])/g, "-$1")
          .toLowerCase();

        state.selectedElement.style.setProperty(cssProperty, value, "important");
        
        console.log(`Updated ${cssProperty} to ${value}`); 
      }
      return {};
    });
  },

  updateSelectedElementAttribute: (attr, value) => {
    set((state) => {
      if (state.selectedElement) {
        state.selectedElement.setAttribute(attr, value);
        
        if (attr === "src" && state.selectedElement.tagName === "IMG") {
          if (value.startsWith("data:")) {
            (state.selectedElement as HTMLImageElement).src = value;
          } else {
            (state.selectedElement as HTMLImageElement).src =
              value + "?" + new Date().getTime();
          }
        }
      }
      return {};
    });
  },

  deleteSelectedElement: () => {
    set((state) => {
      if (state.selectedElement) {
        state.selectedElement.remove();
        return { selectedElement: null };
      }
      return {};
    });
  },

  addElement: (type) => {
    set((state) => {
      if (!state.stageRef) return {};

      let newEl: HTMLElement;
      
      const randomTop = Math.random() * 300 + 150; 
      const randomLeft = Math.random() * 300 + 150; 

      if (type === "text") {
        newEl = document.createElement("p");
        newEl.textContent = "New Text Block";
        newEl.style.position = "absolute";
        newEl.style.top = `${randomTop}px`;
        newEl.style.left = `${randomLeft}px`;
        newEl.style.fontSize = "18px";
        newEl.style.color = "#000000";
        newEl.style.fontWeight = "500";
        newEl.style.padding = "8px";
        newEl.style.borderRadius = "4px";
        newEl.style.cursor = "move";
        newEl.style.whiteSpace = "nowrap";
      } else {
        newEl = document.createElement("img");
        (newEl as HTMLImageElement).src = "https://via.placeholder.com/200";
        (newEl as HTMLImageElement).alt = "Placeholder Image";
        newEl.style.position = "absolute";
        newEl.style.top = `${randomTop}px`;
        newEl.style.left = `${randomLeft}px`;
        newEl.style.width = "200px";
        newEl.style.height = "200px";
        newEl.style.objectFit = "cover";
        newEl.style.borderRadius = "8px";
        newEl.style.cursor = "move";
      }

      state.stageRef.appendChild(newEl);
      get().setSelectedElement(newEl);
      return {};
    });
  },
}));