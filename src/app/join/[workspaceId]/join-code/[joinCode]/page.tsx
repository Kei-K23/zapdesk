import JoinCodeScreen from "@/features/join/components/join-code-screen";

interface JoinCodePageProps {
  params: Promise<{
    joinCode: string;
  }>;
}

export default async function JoinCodePage(props: JoinCodePageProps) {
  const params = await props.params;
  return <JoinCodeScreen joinCode={params.joinCode} />;
}
