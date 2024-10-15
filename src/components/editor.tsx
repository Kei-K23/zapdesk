import Quill, { QuillOptions } from "quill";
import "quill/dist/quill.snow.css";
import { useEffect, useRef } from "react";

export default function Editor() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );

    // Editor option
    const options: QuillOptions = {
      theme: "snow",
    };

    // Create editor DOM element with options
    new Quill(editorContainer, options);

    return () => {
      if (container) {
        container.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col border border-neutral-700/80 rounded-lg overflow-hidden focus-within:shadow-sm transition-all bg-neutral-900/80">
        <div ref={containerRef} className="h-full ql-custom" />
      </div>
    </div>
  );
}
