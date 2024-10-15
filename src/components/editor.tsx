import Quill, { QuillOptions } from "quill";
import "quill/dist/quill.snow.css";
import {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Button } from "./ui/button";
import { PiTextAa } from "react-icons/pi";
import { ImageIcon, Smile } from "lucide-react";
import { MdSend } from "react-icons/md";
import Hint from "./hint";
import { Delta, Op } from "quill/core";

type EditorValue = {
  image: File | null;
  body: string;
};

interface EditorProps {
  onSubmit: ({ image, body }: EditorValue) => void;
  onCancel?: () => void;
  placeholder?: string;
  defaultValue?: Delta | Op[];
  disabled?: boolean;
  innerRef?: MutableRefObject<Quill | null>;
  variant?: "create" | "update";
}

export default function Editor({
  variant = "create",
  placeholder = "Awesome message...",
  disabled = false,
  defaultValue = [],
  innerRef,
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

  useLayoutEffect(() => {
    submitRef.current = onSubmit;
    defaultValueRef.current = defaultValue;
    disabledRef.current = disabled;
  }, [
    submitRef,
    defaultValueRef,
    disabledRef,
    placeholder,
    defaultValue,
    disabled,
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
                return;
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
  }, [placeholder, innerRef]);

  const isEmpty = text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

  return (
    <div className="flex flex-col">
      <div className="flex flex-col border border-neutral-700/80 rounded-lg overflow-hidden focus-within:shadow-sm transition-all bg-neutral-900/80">
        <div ref={containerRef} className="h-full ql-custom" />
        <div className="flex px-2 pb-2 z-[5]">
          <Hint
            label={isToolbarVisible ? "Hide formatting" : "Show formatting"}
          >
            <Button
              disabled={false}
              size={"iconSm"}
              variant={"ghost"}
              onClick={toggleToolbar}
            >
              <PiTextAa className="size-4" />
            </Button>
          </Hint>
          <Hint label="Smile">
            <Button
              disabled={false}
              size={"iconSm"}
              variant={"ghost"}
              onClick={() => {}}
            >
              <Smile className="size-4" />
            </Button>
          </Hint>
          {variant === "create" && (
            <>
              <Hint label="Image">
                <Button
                  disabled={false}
                  size={"iconSm"}
                  variant={"ghost"}
                  onClick={() => {}}
                >
                  <ImageIcon className="size-4" />
                </Button>
              </Hint>
              <Button
                disabled={disabled || isEmpty}
                size={"iconSm"}
                variant={"primary"}
                onClick={() => {}}
                className="ml-auto"
              >
                <MdSend className="size-4" />
              </Button>
            </>
          )}
          {variant === "update" && (
            <>
              <Button
                disabled={false}
                size={"iconSm"}
                variant={"ghost"}
                onClick={() => {}}
              >
                Cancel
              </Button>
              <Button
                disabled={disabled || isEmpty}
                size={"iconSm"}
                variant={"primary"}
                onClick={() => {}}
                className="ml-auto"
              >
                Save
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="p-2 text-[10px] text-muted-foreground flex justify-end">
        <p>
          <strong>Shift + Return</strong> to add new line
        </p>
      </div>
    </div>
  );
}
