import { JSONContent, ReactNodeViewRenderer } from "@tiptap/react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Typography from "@tiptap/extension-typography";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { all, createLowlight } from "lowlight";
import { CodeBlockComponent } from "./code-block-component";

import "./style.css";

const lowlight = createLowlight(all);

interface ContentDisplayProps {
  content: JSONContent;
}

export function ContentDisplay({ content }: ContentDisplayProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image,
      Link.configure({
        openOnClick: true,
      }),
      Typography,
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer((c) =>
            CodeBlockComponent({ isDisabled: true, ...c })
          );
        },
      }).configure({ lowlight }),
    ],
    content,
    editable: false,
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto",
      },
    },
  });

  return (
    <div className="border rounded-lg p-4 bg-card">
      <EditorContent editor={editor} className="min-h-[150px]" />
    </div>
  );
}
