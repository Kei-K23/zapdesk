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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface ProfileTagsProps {
  user: Doc<"users">;
  isLoading: boolean;
  followers: Doc<"users">[];
  following: Doc<"users">[];
}

export default function ProfileTags({
  user,
  isLoading,
  followers,
  following,
}: ProfileTagsProps) {
  const [tagSelected, setTagSelected] = useState<
    "about" | "social" | "contact" | "followers" | "following" | ""
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
        <TabsTrigger
          disabled={isLoading}
          onClick={() => setTagSelected("followers")}
          value="followers"
          className={cn(
            "disabled:cursor-not-allowed",
            tagSelected === "followers" && "underline"
          )}
        >
          Followers
        </TabsTrigger>
        <TabsTrigger
          disabled={isLoading}
          onClick={() => setTagSelected("following")}
          value="following"
          className={cn(
            "disabled:cursor-not-allowed",
            tagSelected === "following" && "underline"
          )}
        >
          Following
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
      <TabsContent value="followers" className="space-y-4">
        {followers.length ? (
          <div className="space-y-6 mt-5">
            {followers.map((follower) => (
              <div
                key={follower._id}
                className="border-b border-b-neutral-700 pb-5 flex items-center justify-between gap-x-5"
              >
                <div className="flex flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
                  <Avatar className="size-14">
                    <AvatarImage src={follower?.image} alt={follower?.name} />
                    <AvatarFallback className="text-3xl font-semibold">
                      {follower?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="text-[15px] font-semibold">
                      {follower?.name}
                    </p>
                    <p className="text-[13px] font-semibold text-muted-foreground">
                      {follower?.role}
                    </p>
                  </div>
                </div>
                <Button variant={"transparent"} size={"sm"}>
                  Follow
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground my-5 text-center">No followers</p>
        )}
      </TabsContent>
      <TabsContent value="following" className="space-y-4">
        {following.length ? (
          <div className="space-y-6 mt-5">
            {following.map((f) => (
              <div
                key={f._id}
                className="border-b border-b-neutral-700 pb-5 flex items-start justify-between gap-x-5"
              >
                <div className="flex flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
                  <Avatar className="size-14">
                    <AvatarImage src={f?.image} alt={f?.name} />
                    <AvatarFallback className="text-3xl font-semibold">
                      {f?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="text-[15px] font-semibold">{f?.name}</p>
                    <p className="text-[13px] font-semibold text-muted-foreground">
                      {f?.role}
                    </p>
                  </div>
                </div>
                <Button variant={"transparent"} size={"sm"}>
                  Follow
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground my-5 text-center">
            No following users
          </p>
        )}
      </TabsContent>
    </Tabs>
  );
}
