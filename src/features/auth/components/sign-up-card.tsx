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
import { FaGithub } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";

type SignUpCardProps = {
  setAuthFlow: React.Dispatch<React.SetStateAction<AuthFlow>>;
};

export default function SignUpCard({ setAuthFlow }: SignUpCardProps) {
  return (
    <div>
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>Enter your email below to sign up</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input id="confirmPassword" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
            <div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <span>or</span>
              <Separator className="flex-1" />
            </div>
            <Button
              variant="outline"
              className="w-full flex items-center gap-1"
            >
              <FcGoogle className="size-5" /> Continue with Google
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center gap-1"
            >
              <FaGithub className="size-5" /> Continue with GitHub
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Button
              variant={"link"}
              className="p-0"
              onClick={() => setAuthFlow("signIn")}
            >
              Sign in
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
