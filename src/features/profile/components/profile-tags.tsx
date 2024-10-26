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

interface ProfileTagsProps {
  user: Doc<"users">;
}

export default function ProfileTags({ user }: ProfileTagsProps) {
  return (
    <Tabs defaultValue="about" className="w-full">
      <TabsList className="w-full justify-start">
        <TabsTrigger value="about">About</TabsTrigger>
        <TabsTrigger value="social">Social</TabsTrigger>
        <TabsTrigger value="contact">Contact</TabsTrigger>
      </TabsList>
      <TabsContent value="about" className="space-y-4">
        <div>
          <Label>Bio</Label>
          <Textarea
            value={user?.bio}
            readOnly
            className="mt-1 focus-visible:ring-0"
          />
        </div>
      </TabsContent>
      <TabsContent value="social" className="space-y-4">
        {user?.githubLink && (
          <div className="flex items-center space-x-2">
            <Github className="w-4 h-4" />
            <Input
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
