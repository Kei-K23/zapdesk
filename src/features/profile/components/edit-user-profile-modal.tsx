import { useState } from "react";
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

type User = {
  name: string;
  image: string;
  email: string;
  isPublishEmail: boolean;
  bio: string;
  role: string;
  githubLink: string;
  personalLink: string;
  twitterLink: string;
  youTubeLink: string;
  igLink: string;
  phone: string;
  isAnonymous: boolean;
  followers: number;
  following: number;
};

type EditUserProfileModalProps = {
  user: User;
  onSave: (updatedUser: User) => void;
};

export function EditUserProfileModal({
  user,
  onSave,
}: EditUserProfileModalProps) {
  const [editedUser, setEditedUser] = useState<User>(user);

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
    onSave(editedUser);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
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
                id="name"
                name="name"
                value={editedUser.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="w-1/2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                value={editedUser.email}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="w-full flex items-center gap-x-4">
            <div className="w-1/2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                name="role"
                value={editedUser.role}
                onChange={handleInputChange}
              />
            </div>
            <div className="w-1/2 flex items-center space-x-2">
              <Switch
                id="isPublishEmail"
                checked={editedUser.isPublishEmail}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="isPublishEmail">Publish Email</Label>
            </div>
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={editedUser.bio}
              onChange={handleInputChange}
            />
          </div>
          <div className="w-full flex items-center gap-x-4">
            <div className="w-1/2">
              <Label htmlFor="githubLink">GitHub</Label>
              <Input
                id="githubLink"
                name="githubLink"
                value={editedUser.githubLink}
                onChange={handleInputChange}
              />
            </div>
            <div className="w-1/2">
              <Label htmlFor="personalLink">Personal Website</Label>
              <Input
                id="personalLink"
                name="personalLink"
                value={editedUser.personalLink}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="w-full flex items-center gap-x-4">
            <div className="w-1/2">
              <Label htmlFor="twitterLink">Twitter</Label>
              <Input
                id="twitterLink"
                name="twitterLink"
                value={editedUser.twitterLink}
                onChange={handleInputChange}
              />
            </div>
            <div className="w-1/2">
              <Label htmlFor="youTubeLink">YouTube</Label>
              <Input
                id="youTubeLink"
                name="youTubeLink"
                value={editedUser.youTubeLink}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="w-full flex items-center gap-x-4">
            <div className="w-1/2">
              <Label htmlFor="igLink">Instagram</Label>
              <Input
                id="igLink"
                name="igLink"
                value={editedUser.igLink}
                onChange={handleInputChange}
              />
            </div>
            <div className="w-1/2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={editedUser.phone}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <Button type="submit">Save Changes</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
