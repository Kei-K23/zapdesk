import Editor, { EditorValue } from "@/components/editor";
import useGenerateImageUrl from "@/features/messages/mutation/use-generate-image-url";
import { useToast } from "@/hooks/use-toast";
import Quill from "quill";
import { useRef, useState } from "react";

export default function CommentEditor() {
  const [isPending, setIsPending] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [rerenderEditor, setRerenderEditor] = useState(0);
  const { toast } = useToast();
  const editorRef = useRef<Quill | null>(null);
  const imageElementRef = useRef<HTMLInputElement | null>(null);



  const { mutate: createMessageMutation } = ();
  const { mutate: generateImageUrlMutation } = useGenerateImageUrl();

  const handleSubmit = async ({ image, body }: EditorValue) => {
    try {
      setIsPending(true);
      editorRef?.current?.enable(false);
      const value: CreateMessageValue = {
        workspaceId,
        channelId,
        body,
        image: undefined,
      };

      // Image upload here
      if (image) {
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
        value.image = storageId;
      }

      // Create the message
      await createMessageMutation(
        {
          ...value,
        },
        {
          onSuccess: () => {
            // Clear the editor by re-rendering the state
            setRerenderEditor((prev) => prev + 1);
            imageElementRef.current!.value = "";
            setImage(null);
          },
          onError: () => {
            throw new Error("Failed to send message");
          },
        }
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast({
        title: e.message,
        description:
          "Something went wrong when sending message. Please try again",
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
      editorRef?.current?.enable(true);
    }
  };

  return (
    <div className="w-full  max-w-3xl mx-auto mt-6">
      <h3 className="text-lg mb-4">Response</h3>
      <Editor
        image={image}
        setImage={setImage}
        rerenderEditor={rerenderEditor}
        disabled={isPending}
        onSubmit={() => {}}
        placeholder={"Write a response"}
        innerRef={editorRef}
        imageRef={imageElementRef}
      />
    </div>
  );
}
