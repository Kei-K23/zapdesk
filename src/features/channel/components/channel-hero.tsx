import { format } from "date-fns";
import React from "react";

interface ChannelHeroProps {
  name: string;
  creationTime: number;
}

export default function ChannelHero({ name, creationTime }: ChannelHeroProps) {
  return (
    <div className="px-5 pt-8 pb-6">
      <h2 className="font-bold text-xl md:text-3xl truncate"># {name}</h2>
      <p className="mt-2">
        This channel was created on{" "}
        {format(new Date(creationTime), "MMMM do, yyyy")}. This is the very
        beginning of the <strong>{name}</strong> channel.
      </p>
    </div>
  );
}
