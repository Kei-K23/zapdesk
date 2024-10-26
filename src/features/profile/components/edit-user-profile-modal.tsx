import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Doc } from "../../../../convex/_generated/dataModel";
import useUpdateUserProfile from "../mutation/update-user-profile";

interface EditUserProfileModalProps {
  user: Doc<"users">;
}

export function EditUserProfileModal({ user }: EditUserProfileModalProps) {
  const [open, setOpen] = useState(false);
  const [editedUser, setEditedUser] = useState<Doc<"users">>(user);
  const {
    mutate: updateUserProfileMutation,
    isPending: updateUserProfileLoading,
  } = useUpdateUserProfile();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setEditedUser((prev) => ({ ...prev, isPublishEmail: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateUserProfileMutation(
      {
        id: user._id,
        name: editedUser.name,
        image: editedUser.image,
        isPublishEmail: editedUser.isPublishEmail,
        bio: editedUser.bio,
        role: editedUser.role,
        githubLink: editedUser.githubLink,
        personalLink: editedUser.personalLink,
        twitterLink: editedUser.twitterLink,
        youTubeLink: editedUser.youTubeLink,
        igLink: editedUser.igLink,
        phone: editedUser.phone,
      },
      {
        onSuccess: () => {
          setOpen(false);
        },
        onError: (e) => {
          console.log(e);
        },
      }
    );
  };

  const isPending = !!!user || updateUserProfileLoading;

  useEffect(() => {
    setEditedUser(user);
  }, [user]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={isPending}
          onClick={() => setOpen(true)}
          variant="outline"
        >
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:sm:max-w-[650px] bg-black">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="w-full flex items-center gap-x-4">
            <div className="w-1/2">
              <Label htmlFor="name">Name</Label>
              <Input
                disabled={isPending}
                id="name"
                name="name"
                value={editedUser?.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="w-1/2">
              <Label htmlFor="role">Role</Label>
              <Input
                disabled={isPending}
                id="role"
                name="role"
                value={editedUser?.role}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              disabled={isPending}
              id="isPublishEmail"
              checked={editedUser?.isPublishEmail}
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="isPublishEmail">Publish Email</Label>
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              disabled={isPending}
              id="bio"
              name="bio"
              value={editedUser?.bio}
              onChange={handleInputChange}
            />
          </div>
          <div className="w-full flex items-center gap-x-4">
            <div className="w-1/2">
              <Label htmlFor="githubLink">GitHub</Label>
              <Input
                disabled={isPending}
                id="githubLink"
                name="githubLink"
                value={editedUser?.githubLink}
                onChange={handleInputChange}
              />
            </div>
            <div className="w-1/2">
              <Label htmlFor="personalLink">Personal Website</Label>
              <Input
                disabled={isPending}
                id="personalLink"
                name="personalLink"
                value={editedUser?.personalLink}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="w-full flex items-center gap-x-4">
            <div className="w-1/2">
              <Label htmlFor="twitterLink">Twitter</Label>
              <Input
                disabled={isPending}
                id="twitterLink"
                name="twitterLink"
                value={editedUser?.twitterLink}
                onChange={handleInputChange}
              />
            </div>
            <div className="w-1/2">
              <Label htmlFor="youTubeLink">YouTube</Label>
              <Input
                disabled={isPending}
                id="youTubeLink"
                name="youTubeLink"
                value={editedUser?.youTubeLink}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="w-full flex items-center gap-x-4">
            <div className="w-1/2">
              <Label htmlFor="igLink">Instagram</Label>
              <Input
                disabled={isPending}
                id="igLink"
                name="igLink"
                value={editedUser?.igLink}
                onChange={handleInputChange}
              />
            </div>
            <div className="w-1/2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                disabled={isPending}
                id="phone"
                name="phone"
                value={editedUser?.phone}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <Button disabled={isPending} type="submit">
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
