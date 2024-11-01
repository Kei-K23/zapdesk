import Quill, { QuillOptions } from "quill";
import "quill/dist/quill.snow.css";
import { RefObject, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { PiTextAa } from "react-icons/pi";
import { ImageIcon, Smile, X } from "lucide-react";
import { MdSend } from "react-icons/md";
import Hint from "./hint";
import { Delta, Op } from "quill/core";
import { cn } from "@/lib/utils";
import EmojiProvider from "./emoji-provider";
import Image from "next/image";

export type EditorValue = {
  image: File | null;
  body: string;
};

interface EditorProps {
  rerenderEditor?: number;
  placeholder?: string;
  defaultValue?: Delta | Op[];
  disabled?: boolean;
  innerRef?: RefObject<Quill | null>;
  imageRef?: RefObject<HTMLInputElement | null>;
  variant?: "create" | "update";
  image?: File | null;
  onSubmit?: ({ image, body }: EditorValue) => void;
  onCancel?: () => void;
  setImage?: React.Dispatch<React.SetStateAction<File | null>>;
}

export default function Editor({
  variant = "create",
  placeholder = "Awesome message...",
  disabled = false,
  defaultValue = [],
  innerRef,
  imageRef,
  rerenderEditor,
  image,
  setImage,
  onSubmit,
  onCancel,
}: EditorProps) {
  const [text, setText] = useState<string>("");
  const [isToolbarVisible, setIsToolbarVisible] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const submitRef = useRef(onSubmit);
  const quillRef = useRef<Quill | null>(null);
  const defaultValueRef = useRef(defaultValue);
  const disabledRef = useRef(disabled);
  const imageElementRef = useRef<HTMLInputElement | null>(null);

  useLayoutEffect(() => {
    submitRef.current = onSubmit;
    defaultValueRef.current = defaultValue;
    disabledRef.current = disabled;
    if (imageRef) {
      imageRef.current = imageElementRef.current;
    }
  }, [
    submitRef,
    defaultValueRef,
    disabledRef,
    placeholder,
    defaultValue,
    disabled,
    imageRef,
    onSubmit,
  ]);

  const toggleToolbar = () => {
    setIsToolbarVisible((current) => !current);
    const toolbarElement = containerRef.current?.querySelector(".ql-toolbar");
    if (toolbarElement) {
      toolbarElement.classList.toggle("hidden");
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );

    // Editor option
    const options: QuillOptions = {
      theme: "snow",
      placeholder,
      modules: {
        toolbar: [
          ["bold", "italic", "strike"],
          ["link"],
          [{ list: "ordered" }, { list: "bullet" }],
        ],
        keyboard: {
          bindings: {
            enter: {
              key: "Enter",
              handler: () => {
                const text = quill.getText();
                const addedImage = imageElementRef?.current?.files![0] || null;
                const isEmpty =
                  text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

                if (isEmpty) return;

                const body = JSON.stringify(quill.getContents());
                if (!!submitRef) {
                  submitRef?.current?.({ body, image: addedImage });
                }
              },
            },
            shift_enter: {
              key: "Enter",
              handler: () => {
                quill.insertText(quill.getSelection()?.index || 0, "/n");
              },
            },
          },
        },
      },
    };

    // Create editor DOM element with options
    const quill = new Quill(editorContainer, options);
    quillRef.current = quill;
    quillRef.current.focus();

    if (innerRef) {
      innerRef.current = quill;
    }

    quill.setContents(defaultValueRef.current);
    setText(quill.getText());

    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText());
    });

    return () => {
      quill.off(Quill.events.TEXT_CHANGE);

      if (container) {
        container.innerHTML = "";
      }

      if (quillRef.current) {
        quillRef.current = null;
      }

      if (innerRef) {
        innerRef.current = null;
      }
    };
  }, [placeholder, innerRef, rerenderEditor]);

  const isEmpty = text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

  //! Emoji picker component does not provide proper data type for emoji, that why use  any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onEmojiSelect = (emoji: any) => {
    quillRef?.current?.insertText(
      quillRef?.current?.getSelection()?.index || 0,
      emoji.native
    );
  };

  return (
    <div className="flex flex-col">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage?.(e.target.files![0])}
        ref={imageElementRef}
        className="hidden"
      />
      <div
        className={cn(
          "flex flex-col border border-neutral-700/80 rounded-lg overflow-hidden focus-within:shadow-sm opacity-100 transition-all bg-neutral-900/80",
          disabled && "opacity-50"
        )}
      >
        <div ref={containerRef} className="h-full w-full ql-custom" />
        {!!image && (
          <div className="p-2">
            <div className="relative size-[80px] rounded-md flex items-center justify-center group/image">
              <Hint label="Remove image">
                <button
                  onClick={() => {
                    setImage?.(null);
                    imageElementRef.current!.value = "";
                  }}
                  className="bg-neutral-200 hidden group-hover/image:flex rounded-full p-0.5 hover:bg-neutral-200/90 transition-all absolute z-10 -top-2 -right-1"
                >
                  <X className="size-4 text-black" />
                </button>
              </Hint>
              <Image
                src={URL.createObjectURL(image)}
                alt="uploaded image"
                fill
                className="object-cover rounded-xl overflow-hidden"
              />
            </div>
          </div>
        )}
        <div className="flex justify-between items-center px-2 pb-2 z-[5]">
          <div>
            <Hint
              label={isToolbarVisible ? "Hide formatting" : "Show formatting"}
            >
              <Button
                disabled={disabled}
                size={"iconSm"}
                variant={"ghost"}
                onClick={toggleToolbar}
              >
                <PiTextAa className="size-4" />
              </Button>
            </Hint>
            <EmojiProvider hint="Smile" onEmojiSelect={onEmojiSelect}>
              <Button disabled={disabled} size={"iconSm"} variant={"ghost"}>
                <Smile className="size-4" />
              </Button>
            </EmojiProvider>
            {variant === "create" && (
              <Hint label="Image">
                <Button
                  disabled={disabled}
                  size={"iconSm"}
                  variant={"ghost"}
                  onClick={() => {
                    imageElementRef?.current?.click();
                  }}
                >
                  <ImageIcon className="size-4" />
                </Button>
              </Hint>
            )}
          </div>
          <div>
            {variant === "create" && (
              <>
                <Button
                  disabled={disabled || isEmpty}
                  size={"iconSm"}
                  variant={"primary"}
                  onClick={() => {
                    onSubmit?.({
                      body: JSON.stringify(quillRef.current?.getContents()),
                      image: image!,
                    });
                  }}
                  className="ml-auto"
                >
                  <MdSend className="size-4" />
                </Button>
              </>
            )}
            {variant === "update" && (
              <div className="flex items-center gap-3">
                <Button
                  disabled={disabled}
                  variant={"ghost"}
                  onClick={onCancel}
                >
                  Cancel
                </Button>
                <Button
                  disabled={disabled || isEmpty}
                  variant={"primary"}
                  onClick={() => {
                    onSubmit?.({
                      body: JSON.stringify(quillRef.current?.getContents()),
                      image: image!,
                    });
                  }}
                >
                  Save
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        className={cn(
          "p-2 text-[10px] text-muted-foreground flex justify-end",
          isEmpty ? "opacity-0" : "opacity-100"
        )}
      >
        <p>
          <strong>Shift + Return</strong> to add new line
        </p>
      </div>
    </div>
  );
}
