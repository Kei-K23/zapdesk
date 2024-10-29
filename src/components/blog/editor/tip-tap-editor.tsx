"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { MenuBar } from "./menu-bar";
import "@/components/blog/editor/style.css";

const lowlight = createLowlight(common);

export function TiptapEditor() {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: "Write something amazing...",
      }),
      Typography,
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none",
      },
    },
  });

  return (
    <div className="min-h-[500px] w-full max-w-screen-lg mx-auto px-4">
      <div className="border rounded-lg">
        <MenuBar editor={editor} />
        <div className="min-h-[500px] p-4">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
