import React from "react";

interface ChannelIdPageProps {
  params: {
    channelId: string;
  };
}

export default function ChannelIdPage({ params }: ChannelIdPageProps) {
  return <div>Channel id page - {params.channelId}</div>;
}
