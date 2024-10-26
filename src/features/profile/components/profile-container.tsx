import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EditUserProfileModal } from "./edit-user-profile-modal";
import ProfileTags from "./profile-tags";
import ProfileFriendshipSection from "./profile-friendship-section";
import ProfileAvatar from "./profile-avatar";
import { Doc } from "../../../../convex/_generated/dataModel";

interface ProfileContainerProps {
  user: Doc<"users">;
  handleSaveProfile: (updatedUser: Doc<"users">) => void;
}

export default function ProfileContainer({
  user,
  handleSaveProfile,
}: ProfileContainerProps) {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader className="relative">
          <ProfileAvatar user={user} />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap justify-center sm:justify-start gap-2">
            <Button variant="outline" size="sm" onClick={() => {}}>
              {true ? "Unfollow" : "Follow"}
            </Button>
            <Button variant="outline" size="sm">
              Message
            </Button>
          </div>
          <ProfileFriendshipSection />
          <Separator />
          <ProfileTags user={user!} />
        </CardContent>
        <CardFooter className="flex justify-between">
          <EditUserProfileModal user={user!} onSave={handleSaveProfile} />
          <Button variant="outline">Share Profile</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
