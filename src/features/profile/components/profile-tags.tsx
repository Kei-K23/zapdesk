import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Github,
  Globe,
  Instagram,
  Mail,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react";
import { Doc } from "../../../../convex/_generated/dataModel";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProfileTagsProps {
  user: Doc<"users">;
  isLoading: boolean;
}

export default function ProfileTags({ user, isLoading }: ProfileTagsProps) {
  const [tagSelected, setTagSelected] = useState<
    "about" | "social" | "contact" | ""
  >("about");

  return (
    <Tabs defaultValue="about" className="w-full">
      <TabsList className="w-full justify-start">
        <TabsTrigger
          disabled={isLoading}
          onClick={() => setTagSelected("about")}
          value="about"
          className={cn(
            "disabled:cursor-not-allowed",
            tagSelected === "about" && "underline"
          )}
        >
          About
        </TabsTrigger>
        <TabsTrigger
          disabled={isLoading}
          onClick={() => setTagSelected("social")}
          value="social"
          className={cn(
            "disabled:cursor-not-allowed",
            tagSelected === "social" && "underline"
          )}
        >
          Social
        </TabsTrigger>
        <TabsTrigger
          disabled={isLoading}
          onClick={() => setTagSelected("contact")}
          value="contact"
          className={cn(
            "disabled:cursor-not-allowed",
            tagSelected === "contact" && "underline"
          )}
        >
          Contact
        </TabsTrigger>
      </TabsList>
      <TabsContent value="about" className="space-y-4">
        <div>
          <Label>Bio</Label>
          <Textarea
            disabled={isLoading}
            value={user?.bio || "No bio provided"}
            readOnly
            className="mt-1 focus-visible:ring-0 resize-none"
          />
        </div>
      </TabsContent>
      <TabsContent value="social" className="space-y-4">
        {user?.githubLink && (
          <div className="flex items-center space-x-2">
            <Github className="w-4 h-4" />
            <Input
              disabled={isLoading}
              className="focus-visible:ring-0"
              value={user?.githubLink}
              readOnly
            />
          </div>
        )}
        {user?.personalLink && (
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4" />
            <Input
              disabled={isLoading}
              className="focus-visible:ring-0"
              value={user?.personalLink}
              readOnly
            />
          </div>
        )}
        {user?.twitterLink && (
          <div className="flex items-center space-x-2">
            <Twitter className="w-4 h-4" />
            <Input
              disabled={isLoading}
              className="focus-visible:ring-0"
              value={user?.twitterLink}
              readOnly
            />
          </div>
        )}
        {user?.youTubeLink && (
          <div className="flex items-center space-x-2">
            <Youtube className="w-4 h-4" />
            <Input
              disabled={isLoading}
              className="focus-visible:ring-0"
              value={user?.youTubeLink}
              readOnly
            />
          </div>
        )}
        {user?.igLink && (
          <div className="flex items-center space-x-2">
            <Instagram className="w-4 h-4" />
            <Input
              disabled={isLoading}
              className="focus-visible:ring-0"
              value={user?.igLink}
              readOnly
            />
          </div>
        )}
      </TabsContent>
      <TabsContent value="contact" className="space-y-4">
        {user?.isPublishEmail && (
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4" />
            <Input
              disabled={isLoading}
              className="focus-visible:ring-0"
              value={user?.email}
              readOnly
            />
          </div>
        )}
        {user?.phone && (
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4" />
            <Input
              disabled={isLoading}
              className="focus-visible:ring-0"
              value={user?.phone}
              readOnly
            />
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
