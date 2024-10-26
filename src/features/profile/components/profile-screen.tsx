/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
"use client";

import { useState } from "react";
import { Doc } from "../../../../convex/_generated/dataModel";
import ProfileContainer from "./profile-container";

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
};

export default function ProfileScreen() {
  const [isFollowing, setIsFollowing] = useState(false);
  const [user, setUser] = useState<Doc<"users">>(initialUser as Doc<"users">);

  const handleSaveProfile = (updatedUser: Doc<"users">) => {
    setUser(updatedUser);
    // Here you would typically send the updated user data to your backend
    console.log("Profile updated:", updatedUser);
  };

  //   const { data: user, isLoading: userLoading } = useCurrentUser();

  //   const { data: followersData, isLoading: followersDataLoading } =
  //     useGetFollowers({ userId: user?._id! });

  return <ProfileContainer user={user} handleSaveProfile={handleSaveProfile} />;
}
