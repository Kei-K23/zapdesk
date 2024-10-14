import JoinCodeScreen from "@/features/join/components/join-code-screen";

interface JoinCodePageProps {
  params: {
    joinCode: string;
  };
}

export default function JoinCodePage({ params }: JoinCodePageProps) {
  return <JoinCodeScreen joinCode={params.joinCode} />;
}
