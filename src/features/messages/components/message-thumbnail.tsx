/* eslint-disable @next/next/no-img-element */
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface MessageThumbnailProps {
  image: string;
}

export default function MessageThumbnail({ image }: MessageThumbnailProps) {
  return (
    <Dialog>
      <DialogTrigger>
        <div className="max-w-[300px] max-h-[250px] relative overflow-hidden border border-lg my-2 cursor-zoom-in">
          <img
            src={image}
            alt="message thumbnail"
            className="size-full object-cover rounded-md"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[800px] h-[500px] p-0">
        <img
          src={image}
          alt="message thumbnail"
          className="size-full object-cover rounded-md"
        />
      </DialogContent>
    </Dialog>
  );
}
