
export const exportHtml = (
    stageElement: HTMLDivElement,
    styleContent: string
  ) => {
    
    const stageClone = stageElement.cloneNode(true) as HTMLDivElement;
    stageClone.querySelectorAll('.selected-element-outline').forEach(el => {
      el.classList.remove('selected-element-outline');
    });
    const bodyContent = stageClone.innerHTML;
  
    const posterHtml = `<div class="poster" style="width: 720px; height: 720px; position: relative; overflow: hidden; background: #f3f4f6; font-family: sans-serif;">
  ${bodyContent}
  </div>`;
  
    const finalHtml = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta data-generated-by="editable-html-poster" />
    <title>Exported Poster</title>
    <style>
      body { margin: 0; padding: 0; }
      ${styleContent}
    </style>
  </head>
  <body>
    ${posterHtml}
  </body>
  </html>`;
  
    const blob = new Blob([finalHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "poster.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };