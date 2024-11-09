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
}

export default function ProfileTags({
  user,
  currentAuthUser,
  isLoading,
  followers,
  following,
}: ProfileTagsProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<
    "about" | "social" | "contact" | "followers" | "following"
  >("about");

  const [followingInProgress, setFollowingInProgress] = useState<
    Set<Id<"users">>
  >(new Set());

  const { mutate: toggleFollowship, isPending: isToggleFollowshipPending } =
    useToggleFriendship();

  const handleToggleFollow = useCallback(
    async (targetUserId: Id<"users">) => {
      if (!currentAuthUser?._id) {
        toast({
          title: "Authentication required",
          description: "Please sign in to follow users.",
          variant: "destructive",
        });
        return;
      }

      if (targetUserId === currentAuthUser._id) {
        toast({
          title: "Invalid action",
          description: "You cannot follow yourself.",
          variant: "destructive",
        });
        return;
      }

      setFollowingInProgress((prev) => {
        const next = new Set(prev);
        next.add(targetUserId);
        return next;
      });

      try {
        await toggleFollowship(
          {
            followerId: currentAuthUser._id,
            followingId: targetUserId,
          },
          {
            onSuccess: () => {
              const isNowFollowing = !isFollowing(targetUserId);
              toast({
                title: isNowFollowing
                  ? "Followed successfully"
                  : "Unfollowed successfully",
                description: isNowFollowing
                  ? `You are now following ${user.name}`
                  : `You have unfollowed ${user.name}`,
              });
            },
            onError: (error) => {
              console.error("Failed to toggle followship:", error);
              toast({
                title: "Action failed",
                description:
                  "Failed to update follow status. Please try again.",
                variant: "destructive",
              });
            },
          }
        );
      } finally {
        setFollowingInProgress((prev) => {
          const next = new Set(prev);
          next.delete(targetUserId);
          return next;
        });
      }
    },
    [currentAuthUser, toggleFollowship, toast, user.name]
  );

  const isFollowing = useCallback(
    (userId: Id<"users">) => {
      return following.some((f) => f.user._id === userId);
    },
    [following]
  );

  const isOwnProfile = useMemo(
    () => currentAuthUser?._id === user._id,
    [currentAuthUser?._id, user._id]
  );

  const renderFollowButton = useCallback(
    (targetUser: Doc<"users">) => {
      if (isOwnProfile) return null;

      const isProcessing = followingInProgress.has(targetUser._id);
      const followingStatus = isFollowing(targetUser._id);

      return (
        <Button
          variant={followingStatus ? "destructive" : "default"}
          size="sm"
          disabled={isProcessing || isToggleFollowshipPending}
          onClick={() => handleToggleFollow(targetUser._id)}
          className="w-28 flex items-center gap-2"
        >
          {isProcessing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : followingStatus ? (
            <>
              <UserMinus className="h-4 w-4" />
              Unfollow
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              Follow
            </>
          )}
        </Button>
      );
    },
    [
      isOwnProfile,
      followingInProgress,
      isToggleFollowshipPending,
      handleToggleFollow,
      isFollowing,
    ]
  );

  const renderUserItem = useCallback(
    (userData: Doc<"users">) => (
      <div
        key={userData._id}
        className="flex items-center justify-between gap-x-5 border-b border-border p-4 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={userData.image} alt={userData.name} />
            <AvatarFallback className="text-xl font-semibold">
              {userData.name?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="font-medium leading-none">{userData.name}</p>
            {userData.role && (
              <p className="text-sm text-muted-foreground">{userData.role}</p>
            )}
          </div>
        </div>
        {renderFollowButton(userData)}
      </div>
    ),
    [renderFollowButton]
  );

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

        <TabsContent value="followers">
          <div className="divide-y divide-border">
            {followers.length > 0 ? (
              followers.map((follower) => renderUserItem(follower.user))
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No followers yet
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="following">
          <div className="divide-y divide-border">
            {following.length > 0 ? (
              following.map((follow) => renderUserItem(follow.user))
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Not following anyone yet
              </p>
            )}
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
}
