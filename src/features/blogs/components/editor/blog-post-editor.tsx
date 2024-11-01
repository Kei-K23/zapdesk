/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
"use client";

import {
  useEditor,
  EditorContent,
  ReactNodeViewRenderer,
  Content,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { all, createLowlight } from "lowlight";
import { MenuBar } from "./menu-bar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useCreateNewBlog from "../../mutation/use-create-new-blog";
import { useEffect, useRef, useState } from "react";

import useGenerateImageUrl from "@/features/messages/mutation/use-generate-image-url";
import "./style.css";
import { useCurrentUser } from "@/features/auth/query/use-current-user";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import Hint from "@/components/hint";
import { ArrowBigLeftDashIcon, ImageIcon, X } from "lucide-react";
import { CodeBlockComponent } from "./code-block-component";
import Image from "next/image";
import { BlogType } from "../../type";
import useUpdateBlog from "../../mutation/use-update-blog";
import { Id } from "../../../../../convex/_generated/dataModel";

const lowlight = createLowlight(all);

interface BlogPostEditorProps {
  blog?: {
    blog: BlogType | null;
    user: {
      name?: string;
      email?: string;
      image?: string;
      role?: string;
      id: Id<"users">;
    } | null;
  } | null;
  content?: Content;
  isPending?: boolean;
}

export function BlogPostEditor({
  blog,
  isPending,
  content,
}: BlogPostEditorProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [title, setTitle] = useState<string>(blog?.blog?.title || "");
  const [description, setDescription] = useState<string>(
    blog?.blog?.description || ""
  );
  const { data: currentUser, isLoading: currentUserLoading } = useCurrentUser();
  const imageElementRef = useRef<HTMLInputElement | null>(null);
  const [image, setImage] = useState<File | string | null | undefined>(
    blog?.blog?.image || null
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: "Write something amazing...",
      }),
      Typography,
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer((c) =>
            CodeBlockComponent({ isDisabled: false, ...c })
          );
        },
      }).configure({ lowlight }),
    ],
    content,
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
  const { mutate: updateBlogMutation, isPending: updateBlogMutationLoading } =
    useUpdateBlog();
  const {
    mutate: generateImageUrlMutation,
    isPending: generateImageUrlMutationLoading,
  } = useGenerateImageUrl();

  const isLoading =
    createNewBlogMutationLoading ||
    updateBlogMutationLoading ||
    currentUserLoading ||
    generateImageUrlMutationLoading ||
    !!isPending;

  const isDisabled =
    !isLoading &&
    !!title &&
    !!!editor?.isEmpty &&
    !!description &&
    image !== null;

  const handleOnSave = async () => {
    let uploadImage;
    if (!editor) return;
    // Get the editor JSON value

    const content = editor.getJSON();
    if (!title || !content || !currentUser?._id || !image) return;

    // Image upload here
    if (image) {
      if (image instanceof File) {
        const imageUploadUrl = await generateImageUrlMutation(
          {},
          {
            throwError: true,
          }
        );

        if (!imageUploadUrl) {
          throw new Error("Cannot upload image");
        }

        const result = await fetch(imageUploadUrl, {
          method: "POST",
          headers: {
            "Content-Type": image.type,
          },
          body: image,
        });

        if (!result.ok) {
          throw new Error("Failed to upload image");
        }

        const { storageId } = await result.json();

        if (!storageId) {
          throw new Error("Failed to upload image");
        }
        uploadImage = storageId;
      }
    }

    const blogData = {
      title,
      description,
      content: JSON.stringify(content),
      image: uploadImage ?? blog?.blog?.imageSecret,
      userId: currentUser._id,
    };

    if (blog?.blog?._id) {
      updateBlogMutation(
        { id: blog?.blog?._id, ...blogData },
        {
          onSuccess: () => {
            toast({ title: "Successfully updated the blog" });
            setTitle("");
            setDescription("");
            editor.destroy();
            router.replace(`/blogs/${blog?.blog?._id}`);
          },
          onError: (e) => {
            toast({ title: "Error when updating blog" });
          },
        }
      );
    } else {
      createNewBlogMutation(blogData, {
        onSuccess: () => {
          toast({ title: "Successfully create the blog" });
          setTitle("");
          setDescription("");
          editor.destroy();
          router.replace("/blogs");
        },
        onError: () => {
          toast({ title: "Error when creating blog" });
        },
      });
    }
  };

  // Disabled the editor when loading the data
  editor?.setEditable(!isLoading);

  useEffect(() => {
    if (blog?.blog) {
      setTitle(blog?.blog?.title);
      setDescription(blog?.blog?.description);
      setImage(blog?.blog?.image);
      editor?.commands.setContent(JSON.parse(blog.blog.content));
    }
  }, [blog, editor]);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="w-full max-w-3xl mx-auto">
        <div className="fixed top-4 left-80">
          <Hint label="Back">
            <Button
              variant={"ghost"}
              onClick={() => {
                if (blog?.blog?._id) {
                  // In edit page
                  router.replace(`/blogs/${blog?.blog?._id}`);
                } else {
                  // In create page
                  router.replace("/blogs");
                }
              }}
            >
              <ArrowBigLeftDashIcon className="size-6 text-muted-foreground" />
            </Button>
          </Hint>
        </div>
        <h2 className="text-2xl">Create New Blog</h2>
        <div className="space-y-4 mt-5">
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
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              disabled={isLoading}
              id="description"
              placeholder="Awesome description"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="min-h-[150px]">
            <div className="border rounded-lg">
              <MenuBar isLoading={isLoading} editor={editor} />
              <div className="min-h-[150px] p-4">
                <EditorContent
                  disabled={isLoading}
                  editor={editor}
                  className="disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>
          {!!!image && (
            <>
              <Button
                size={"iconSm"}
                variant={"ghost"}
                disabled={isLoading}
                onClick={() => {
                  imageElementRef?.current?.click();
                }}
              >
                <ImageIcon className="size-10" />
              </Button>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage?.(e.target.files![0])}
                ref={imageElementRef}
                className="hidden"
              />
            </>
          )}

          {!!image && (
            <div className="p-2">
              <div className="relative size-[100px] rounded-md flex items-center justify-center group/image">
                <Hint label="Remove image">
                  <button
                    onClick={() => {
                      setImage?.(null);
                      if (imageElementRef.current) {
                        imageElementRef.current!.value = "";
                      }
                    }}
                    className="bg-neutral-200 hidden group-hover/image:flex rounded-full p-0.5 hover:bg-neutral-200/90 transition-all absolute z-10 -top-2 -right-1"
                  >
                    <X className="size-4 text-black" />
                  </button>
                </Hint>
                <Image
                  src={
                    typeof image === "string"
                      ? image
                      : URL.createObjectURL(image)
                  }
                  alt="uploaded image"
                  fill
                  className="object-cover rounded-xl overflow-hidden"
                />
              </div>
            </div>
          )}
          <Button
            onClick={handleOnSave}
            disabled={isLoading || !isDisabled}
            type="submit"
            variant={"primary"}
            className="w-full disabled:cursor-not-allowed"
          >
            {!!blog ? "Save" : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
}
