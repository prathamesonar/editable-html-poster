# Editable HTML Poster

**This is a web application, built with Next.js and TypeScript, that allows a user to import an HTML file, visually edit its content (text, images, and layout), and export the modified HTML.**

This project was built as a solution for the Frontend Engineer Evaluation Task.

---
##  Screenshots


| Home Page                                | Image Properties                                    |
| ---------------------------------------------------- | ------------------------------------------------------ |
| ![Home Page](https://github.com/user-attachments/assets/6cdb250d-31d8-4916-a041-8bbc2ade1b85) | ![image-properties](https://github.com/user-attachments/assets/b804933b-fc48-4d3e-8344-070af53f950d) |

| Text Editing                                     | Editor                                     |
| ------------------------------------------------- | ------------------------------------------------------ |
| ![text-editing)](https://github.com/user-attachments/assets/e6aebdcf-d814-48de-8a34-3fc585c921df) | ![full-editor-demo](https://github.com/user-attachments/assets/93612561-dc2e-4284-9ec6-3d5850da6b56) |

| Paste HTML                                    | Delete Text                                    |
| ------------------------------------------------- | ------------------------------------------------------ |
| ![paste-html](https://github.com/user-attachments/assets/31872009-df27-4a0d-b8d0-f1759e742da3) | ![delete-txt](https://github.com/user-attachments/assets/73178fbb-a488-404d-aec1-6b3ca9864ce6) |

---
##  Features

-   **Import HTML:** Load an existing `.html` file or paste raw HTML.
-   **Visual Editing:** Drag and drop elements to reposition them.
-   **Inline Text Editing:** Double-click text elements (`<h1>`, `<p>`, etc.) to edit content.
-   **Property Inspector:** Select an element to edit its properties:
    -   **Text:** Change font size, color, and weight.
    -   **Images:** Update the `src`, `alt` text, width, and height.
-   **Add Elements:** Add new text blocks and images to the canvas.
-   **Delete Elements:** Remove any selected element.
-   **Export HTML:** Download the modified DOM as a complete `.html` file.

---
## 🛠️ Tech Stack

-   **Framework:** Next.js (App Router)
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS
-   **State Management:** Zustand
-   **Drag & Drop:** React-Draggable
-   **HTML Sanitization:** DOMPurify

---
##  Getting Started

### 1. Prerequisites

- Node.js (v18 or later)
- npm or yarn

### 2. Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/prathamesonar/editable-html-poster.git
    cd editable-html-poster
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### 3. Running the Application

To start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

---

##  Architectural Explanation

This application is built using Next.js (App Router), TypeScript, and Tailwind CSS. State is managed by **Zustand**, and DOM interactions are handled with **React-Draggable** and **DOMPurify**.

### Core Concepts

1.  **State Management (Zustand):**
    A single global store (`store/useEditorStore.ts`) holds the application state. This includes:
    * `rawHtml`: The original imported HTML string.
    * `bodyContent` / `styleContent`: The parsed and sanitized content for the stage and styles.
    * `selectedElement`: A direct reference to the *live DOM node* currently selected by the user.
    * `stageRef`: A reference to the main `720x720` stage `<div>`.

2.  **Imperative DOM Management (The Stage):**
    The biggest challenge is allowing React to manage the UI *around* a piece of content that is being manipulated directly.
    * The `<Stage>` component uses a `useEffect` hook to set the `innerHTML` of the stage `<div>` *imperatively* when the `bodyContent` (from an import) changes.
    * This prevents React from re-rendering the stage's children and destroying user edits (like moved positions or edited text).

3.  **Element Selection & Editing:**
    * **Selection:** A click listener on the `<Stage>` captures click events, identifies the `e.target`, and saves that `HTMLElement` to the `selectedElement` state. A CSS class (`selected-element-outline`) is applied for the visual outline.
    * **Text Edit:** A double-click listener sets `contentEditable=true` on text elements, allowing for true inline editing. The change is saved directly to the DOM.
    * **Movement:** The `<SelectionOverlay>` component is rendered *on top of* the stage (not *in* it). It uses `react-draggable` and positions itself over the `selectedElement`. On drag-stop, it updates the `selectedElement`'s `style.top` and `style.left` properties, "moving" the real element underneath.

4.  **HTML Import/Export:**
    * **Import:** When HTML is imported (file or paste), it is sanitized using `DOMPurify`. We then use `DOMParser` to find the main content (`.poster`) and the `<style>` block. These are saved to the store, triggering the `Stage` to re-render.
    * **Export:** The `exportHtml` utility (`lib/dom-utils.ts`) reads the `innerHTML` of the `stageRef`, re-wraps it in a full `<html>` document, injects the saved `styleContent`, adds the required `<meta>` tag, and triggers a file download.

---

### SOLID Design Principles

* **S (Single Responsibility Principle):**
    * `useEditorStore`: Manages all application state logic.
    * `Stage.tsx`: Responsible only for rendering the stage, handling clicks, and hosting the overlay.
    * `Toolbar.tsx`: Responsible only for user actions (import, export, add).
    * `PropertiesPanel.tsx`: Responsible only for displaying contextual edit forms.
    * `dom-utils.ts`: Handles the business logic for parsing and exporting HTML.

* **O (Open/Closed Principle):**
    The `PropertiesPanel` is open to extension. To add an editor for `<video>` elements, one could create `VideoProperties.tsx` and add a `case "VIDEO":` to the `switch` statement in `PropertiesPanel` without modifying any other components.

* **D (Dependency Inversion Principle):**
    Components do not depend on each other. The `Toolbar` does not know about the `Stage`. Instead, both depend on the `useEditorStore` abstraction. When the `Toolbar` calls `addElement()`, the store updates, and the `Stage` (which also depends on the store) reacts to the change.

---

##  Known Limitations & Improvements

* **HTML Parsing:** The current parser is basic. It expects a single `.poster` element (or `body`) and a single `<style>` tag. It will not work well with complex, multi-level HTML documents.
* **Styling:** Only inline styles and a single `<style>` block are supported. External stylesheets (`<link>`) are not fetched or applied.
* **Selection:** The current selection logic selects the *top-level* element inside the stage. Selecting nested elements (like the `<strong>` tag in the example) is not supported.
* **No Undo/Redo:** This is a major feature that is not implemented, as it was listed as optional. This would require a more complex state management system (e.g., storing a history of actions).
* **Basic Properties:** The property editors are basic. A true "poster editor" would have more advanced controls for fonts, shadows, borders, etc.
