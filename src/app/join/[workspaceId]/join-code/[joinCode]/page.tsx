import JoinCodeScreen from "@/features/join/components/join-code-screen";

interface JoinCodePageProps {
  params: {
    joinCode: string;
  };
}

export default async function JoinCodePage({ params }: JoinCodePageProps) {
  return <JoinCodeScreen joinCode={params.joinCode} />;
}
