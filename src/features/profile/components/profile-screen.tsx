/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Dot,
  Github,
  Globe,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Users,
  Youtube,
} from "lucide-react";
import { useCurrentUser } from "@/features/auth/query/use-current-user";
import useGetFollowers from "@/features/friendships/query/use-get-followers";
import useGetFollowings from "@/features/friendships/query/use-get-followings";
import { EditUserProfileModal } from "./edit-user-profile-modal";

// Mock user data based on the provided schema
const initialUser = {
  name: "Jane Doe",
  image: "/placeholder.svg?height=128&width=128",
  email: "jane.doe@example.com",
  isPublishEmail: true,
  bio: "Passionate developer and tech enthusiast. Always learning, always coding.",
  role: "Senior Software Engineer",
  githubLink: "https://github.com/janedoe",
  personalLink: "https://janedoe.com",
  twitterLink: "https://twitter.com/janedoe",
  youTubeLink: "https://youtube.com/janedoe",
  igLink: "https://instagram.com/janedoe",
  phone: "+1 (555) 123-4567",
  isAnonymous: false,
  followers: 1234,
  following: 567,
};

export default function ProfileScreen() {
  const { theme, setTheme } = useTheme();
  const [isFollowing, setIsFollowing] = useState(false);
  const [user, setUser] = useState(initialUser);

  const handleSaveProfile = (updatedUser: typeof user) => {
    setUser(updatedUser);
    // Here you would typically send the updated user data to your backend
    console.log("Profile updated:", updatedUser);
  };

  //   const { data: user, isLoading: userLoading } = useCurrentUser();

  //   const { data: followersData, isLoading: followersDataLoading } =
  //     useGetFollowers({ userId: user?._id! });
  //   const { data: followingData, isLoading: followingDataLoading } =
  //     useGetFollowings({ userId: user?._id! });

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader className="relative">
          <div className="absolute right-4 top-4 flex items-center space-x-2">
            <Switch
              id="dark-mode"
              checked={theme === "dark"}
              onCheckedChange={() =>
                setTheme(theme === "dark" ? "light" : "dark")
              }
            />
            <Label htmlFor="dark-mode">Dark Mode</Label>
          </div>
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user?.image} alt={user?.name} />
              <AvatarFallback>
                {user?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <CardTitle className="text-2xl">{user?.name}</CardTitle>
              <CardDescription>{user?.role}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap justify-center sm:justify-start gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFollowing(!isFollowing)}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
            <Button variant="outline" size="sm">
              Message
            </Button>
          </div>
          <div className="mt-1 flex items-center gap-x-0.5 text-muted-foreground text-sm">
            <div className="flex items-center gap-x-0.5">
              <Users className="size-4 mr-1" />
              <div>
                <strong className="text-neutral-100 text-[16px]">
                  {/* {followersData?.length} */}
                  100
                </strong>{" "}
                followers
              </div>
            </div>
            <div>
              <Dot className="size-5 text-neutral-100" />
            </div>
            <div>
              <strong className="text-neutral-100 text-[16px]">
                {/* {followingData?.length} */}
                40
              </strong>{" "}
              following
            </div>
          </div>
          <Separator />
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="space-y-4">
              <div>
                <Label>Bio</Label>
                <Textarea value={user?.bio} readOnly className="mt-1" />
              </div>
            </TabsContent>
            <TabsContent value="social" className="space-y-4">
              {user?.githubLink && (
                <div className="flex items-center space-x-2">
                  <Github className="w-4 h-4" />
                  <Input value={user?.githubLink} readOnly />
                </div>
              )}
              {user?.personalLink && (
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4" />
                  <Input value={user?.personalLink} readOnly />
                </div>
              )}
              {user?.twitterLink && (
                <div className="flex items-center space-x-2">
                  <Twitter className="w-4 h-4" />
                  <Input value={user?.twitterLink} readOnly />
                </div>
              )}
              {user?.youTubeLink && (
                <div className="flex items-center space-x-2">
                  <Youtube className="w-4 h-4" />
                  <Input value={user?.youTubeLink} readOnly />
                </div>
              )}
              {user?.igLink && (
                <div className="flex items-center space-x-2">
                  <Instagram className="w-4 h-4" />
                  <Input value={user?.igLink} readOnly />
                </div>
              )}
            </TabsContent>
            <TabsContent value="contact" className="space-y-4">
              {user?.isPublishEmail && (
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <Input value={user?.email} readOnly />
                </div>
              )}
              {user?.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <Input value={user?.phone} readOnly />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <EditUserProfileModal user={user} onSave={handleSaveProfile} />
          <Button variant="outline">Share Profile</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
