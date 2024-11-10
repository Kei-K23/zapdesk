"use client";

import { useState, useCallback, useMemo } from "react";
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
  UserPlus,
  UserMinus,
  Loader2,
} from "lucide-react";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import useToggleFriendship from "@/features/friendships/mutation/use-toggle-friendship";
import { useToast } from "@/hooks/use-toast";
import FriendshipTag from "./friendship-tag";

interface ProfileTagsProps {
  user: Doc<"users">;
  currentAuthUser?: Doc<"users">;
  isLoading: boolean;
  followers: Array<{
    user: Doc<"users">;
    friendships: Doc<"friendships">;
  }>;
  following: Array<{
    user: Doc<"users">;
    friendships: Doc<"friendships">;
  }>;
  currentAuthUserFollowing?: Array<{
    user: Doc<"users">;
    friendships: Doc<"friendships">;
  }>;
}

export default function ProfileTags({
  user,
  currentAuthUser,
  isLoading,
  followers,
  following,
  currentAuthUserFollowing,
}: ProfileTagsProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<
    "about" | "social" | "contact" | "followers" | "following"
  >("about");

  const socialLinks = useMemo(
    () => [
      { icon: Github, link: user?.githubLink, label: "GitHub" },
      { icon: Globe, link: user?.personalLink, label: "Website" },
      { icon: Twitter, link: user?.twitterLink, label: "Twitter" },
      { icon: Youtube, link: user?.youTubeLink, label: "YouTube" },
      { icon: Instagram, link: user?.igLink, label: "Instagram" },
    ],
    [user]
  );

  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <Tabs
      value={activeTab}
      onValueChange={(v) => setActiveTab(v as typeof activeTab)}
      className="w-full"
    >
      <TabsList className="w-full justify-start border-b rounded-none h-auto p-0">
        {["about", "social", "contact", "followers", "following"].map((tab) => (
          <TabsTrigger
            key={tab}
            value={tab}
            className={cn(
              "rounded-none border-b-2 border-transparent px-4 py-2",
              activeTab === tab && "border-primary"
            )}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {(tab === "followers" || tab === "following") && (
              <span className="ml-2 text-sm text-muted-foreground">
                {tab === "followers" ? followers.length : following.length}
              </span>
            )}
          </TabsTrigger>
        ))}
      </TabsList>

      <div className="mt-6">
        <TabsContent value="about">
          <div className="space-y-4">
            <div>
              <Label>Bio</Label>
              <Textarea
                value={user?.bio || "No bio provided"}
                readOnly
                className="mt-2 resize-none bg-muted"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="social">
          <div className="space-y-4">
            {socialLinks.map(
              ({ icon: Icon, link, label }) =>
                link && (
                  <div key={label} className="flex items-center gap-x-2">
                    <Icon className="h-4 w-4 shrink-0" />
                    <Input value={link} readOnly className="bg-muted" />
                  </div>
                )
            )}
            {!socialLinks.some(({ link }) => link) && (
              <p className="text-muted-foreground text-center py-4">
                No social links provided
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="contact">
          <div className="space-y-4">
            {user?.isPublishEmail && (
              <div className="flex items-center gap-x-2">
                <Mail className="h-4 w-4 shrink-0" />
                <Input value={user.email} readOnly className="bg-muted" />
              </div>
            )}
            {user?.phone && (
              <div className="flex items-center gap-x-2">
                <Phone className="h-4 w-4 shrink-0" />
                <Input value={user.phone} readOnly className="bg-muted" />
              </div>
            )}
            {!user?.isPublishEmail && !user?.phone && (
              <p className="text-muted-foreground text-center py-4">
                No contact information available
              </p>
            )}
          </div>
        </TabsContent>
        <FriendshipTag
          user={user}
          currentAuthUser={currentAuthUser}
          currentAuthUserFollowing={currentAuthUserFollowing}
          followers={followers}
          following={following}
        />
      </div>
    </Tabs>
  );
}
