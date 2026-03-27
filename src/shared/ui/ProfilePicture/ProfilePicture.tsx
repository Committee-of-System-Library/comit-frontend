import type { HTMLAttributes } from "react";

import { ImagePlus } from "lucide-react";

import { cn } from "@/utils/cn";

interface ProfilePictureProps extends HTMLAttributes<HTMLDivElement> {
  imgURL?: string | null;
  alt?: string;
  isEditing?: boolean;
}

export const ProfilePicture = ({
  imgURL,
  alt = "profile picture",
  isEditing = false,
  className,
  ...props
}: ProfilePictureProps) => {
  return (
    <div
      className={cn(
        "bg-background-dark flex size-[78px] shrink-0 items-center justify-center overflow-hidden rounded-full",
        (!imgURL || isEditing) && "border border-border-deactivated",
        className,
      )}
      {...props}
    >
      {isEditing ? (
        <div className="flex flex-col items-center justify-center gap-1">
          <ImagePlus className="text-gray-400 size-6" />
        </div>
      ) : imgURL ? (
        <img src={imgURL} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <span className="text-gray-400 text-[10px] font-medium uppercase tracking-tighter">
          No Image
        </span>
      )}
    </div>
  );
};
