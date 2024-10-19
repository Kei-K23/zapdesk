import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ConversationHeroProps {
  name: string;
  image: string | undefined;
}

export default function ConversationHero({
  name,
  image,
}: ConversationHeroProps) {
  const fallbackAvatar = name?.charAt(0).toUpperCase();

  return (
    <div className="px-5 pt-8 pb-6">
      <div className="flex gap-x-2 items-center">
        <Avatar className="size-16 hover:opacity-75 transition-all mr-2 rounded-md">
          <AvatarImage src={image} alt={name} />
          <AvatarFallback className="text-white rounded-md text-[16px] bg-indigo-600 font-bold">
            {fallbackAvatar}
          </AvatarFallback>
        </Avatar>
        <span className="font-bold text-xl md:text-3xl truncate">{name}</span>
      </div>
      <p className="mt-2">
        This is private one to one conversation with <strong>{name}</strong> and
        you
      </p>
    </div>
  );
}
