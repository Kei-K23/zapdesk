import React from "react";

type WorkspaceIdPageProps = {
  params: {
    workspaceId: string;
  };
};

export default function WorkspaceIdPage({ params }: WorkspaceIdPageProps) {
  return <div>Workspace Id : {params.workspaceId}</div>;
}
