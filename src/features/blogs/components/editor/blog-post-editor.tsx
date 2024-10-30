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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useCreateNewBlog from "../../mutation/use-create-new-blog";
import { useState } from "react";

import "./style.css";
import { useCurrentUser } from "@/features/auth/query/use-current-user";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const lowlight = createLowlight(common);

export function BlogPostEditor() {
  const { toast } = useToast();
  const router = useRouter();
  const [title, setTitle] = useState<string>("");
  const { data: currentUser, isLoading: currentUserLoading } = useCurrentUser();

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

  const {
    mutate: createNewBlogMutation,
    isPending: createNewBlogMutationLoading,
  } = useCreateNewBlog();

  const isLoading = createNewBlogMutationLoading || currentUserLoading;

  const handleOnSave = () => {
    if (!editor) return;
    // Get the editor JSON value

    const content = editor.getJSON();
    if (!title || !content || !currentUser?._id) return;

    createNewBlogMutation(
      {
        title,
        content: JSON.stringify(content),
        userId: currentUser._id,
      },
      {
        onSuccess: () => {
          toast({ title: "Successfully create the blog" });
          setTitle("");
          editor.destroy();
          router.replace("/blogs");
        },
        onError: () => {
          toast({ title: "Error when creating blog" });
        },
      }
    );
  };

  // Disabled the editor when loading the data
  editor?.setEditable(!isLoading);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="w-full max-w-3xl mx-auto ">
        <h2 className="text-2xl">Create New Blog</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              disabled={isLoading}
              id="title"
              placeholder="Awesome title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="min-h-[500px]">
            <div className="border rounded-lg">
              <MenuBar isLoading={isLoading} editor={editor} />
              <div className="min-h-[500px] p-4">
                <EditorContent
                  disabled={isLoading}
                  editor={editor}
                  className="disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>
          <Button
            onClick={handleOnSave}
            disabled={isLoading}
            type="submit"
            variant={"primary"}
            className="w-full disabled:cursor-not-allowed"
          >
            Create
          </Button>
        </div>
      </div>
    </div>
  );
}