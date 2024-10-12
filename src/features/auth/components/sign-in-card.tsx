import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { AuthFlow } from "../type";
import { FaExclamationTriangle, FaGithub } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import { useAuthActions } from "@convex-dev/auth/react";
import { FormEvent, useState } from "react";

type SignInCardProps = {
  setAuthFlow: React.Dispatch<React.SetStateAction<AuthFlow>>;
};

export default function SignInCard({ setAuthFlow }: SignInCardProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [pending, setPending] = useState<boolean>(false);
  const { signIn } = useAuthActions();

  const handlePasswordSignIn = (e: FormEvent) => {
    e.preventDefault();
    if (email === "") {
      setError("Email field is required");
      return;
    }
    if (password === "") {
      setError("Password field is required");
      return;
    }

    setPending(true);
    signIn("password", { email, password, flow: "signIn" })
      .catch(() => {
        setError("Invalid email or password");
      })
      .finally(() => setPending(false));
  };

  const handleProviderSignIn = (provider: "github" | "google") => {
    setPending(true);
    signIn(provider).finally(() => setPending(false));
  };

  return (
    <div>
      <Card className="mx-auto max-w-md shadow-lg drop-shadow-xl shadow-violet-500/15">
        <CardHeader>
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>
            Enter your email below to sign in to your account
          </CardDescription>
        </CardHeader>
        {!!error && (
          <div className="bg-destructive/15 rounded-md mx-6 px-3 py-2 text-destructive flex items-center gap-2 text-sm mb-4">
            <FaExclamationTriangle />
            {error}
          </div>
        )}
        <CardContent>
          <div className="grid gap-4">
            <form className="space-y-4" onSubmit={handlePasswordSignIn}>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  disabled={pending}
                  id="email"
                  type="email"
                  placeholder="mygmail@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  disabled={pending}
                  id="password"
                  type="password"
                  placeholder="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button disabled={pending} type="submit" className="w-full">
                Sign In
              </Button>
            </form>
            <div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <span>or</span>
              <Separator className="flex-1" />
            </div>
            <Button
              disabled={pending}
              variant="outline"
              className="w-full flex items-center gap-1"
              onClick={() => void handleProviderSignIn("google")}
            >
              <FcGoogle className="size-5" /> Continue with Google
            </Button>
            <Button
              disabled={pending}
              variant="outline"
              className="w-full flex items-center gap-1"
              onClick={() => void handleProviderSignIn("github")}
            >
              <FaGithub className="size-5" /> Continue with GitHub
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Button
              variant={"link"}
              className="p-0"
              onClick={() => setAuthFlow("signUp")}
            >
              Sign up
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
