import Quill from "quill";
import "quill/dist/quill.snow.css";
import React, { useEffect, useRef, useState } from "react";

interface RendererProps {
  value?: string;
}

export default function Renderer({ value }: RendererProps) {
  const [isEmpty, setIsEmpty] = useState(false);
  const rendererRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!rendererRef.current || !value) return;

    const container = rendererRef.current;

    const quill = new Quill(document.createElement("div"), {
      theme: "snow",
    });
    quill.enable(false);

    const contents = JSON.parse(value);

    quill.setContents(contents);
    const isEmpty =
      quill
        .getText()
        .replace(/<(.|\n)*?>/g, "")
        .trim().length === 0;

    setIsEmpty(isEmpty);

    container.innerHTML = quill.root.innerHTML;

    return () => {
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [value]);

  return <div ref={rendererRef} className="ql-editor ql-renderer" />;
}
