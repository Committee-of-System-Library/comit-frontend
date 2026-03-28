import {
  useRef,
  useState,
  useEffect,
  type HTMLAttributes,
  type ChangeEvent,
} from "react";

import { ImagePlus } from "lucide-react";

import { cn } from "@/utils/cn";

interface ProfilePictureProps extends HTMLAttributes<HTMLButtonElement> {
  imgURL?: string | null;
  alt?: string;
  isEditing?: boolean;
  onImageChange?: (file: File) => void;
}

export const ProfilePicture = ({
  imgURL,
  alt = "profile picture",
  isEditing = false,
  onImageChange,
  className,
  ...props
}: ProfilePictureProps) => {
  const [previewURL, setPreviewURL] = useState<string | null>(imgURL ?? null);
  const [prevImgURL, setPrevImgURL] = useState<string | null>(imgURL ?? null);

  if (imgURL !== prevImgURL) {
    setPrevImgURL(imgURL ?? null);
    setPreviewURL(imgURL ?? null);
  }

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewURL && previewURL.startsWith("blob:")) {
        URL.revokeObjectURL(previewURL);
      }
    };
  }, [previewURL]);

  const handleContainerClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewURL(url);
      onImageChange?.(file);
    }
  };

  return (
    <button
      type="button"
      onClick={handleContainerClick}
      disabled={!isEditing}
      className={cn(
        "bg-background-dark flex size-[78px] shrink-0 items-center justify-center overflow-hidden rounded-full transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600",
        (!previewURL || isEditing) && "border border-border-deactivated",
        isEditing ? "cursor-pointer hover:opacity-80" : "cursor-default",
        className,
      )}
      {...props}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
        tabIndex={-1}
      />
      {isEditing ? (
        <div className="relative flex h-full w-full items-center justify-center">
          {previewURL && (
            <img
              src={previewURL}
              alt={alt}
              className="absolute inset-0 h-full w-full object-cover opacity-40"
            />
          )}
          <ImagePlus className="text-gray-400 relative z-10 size-6" />
        </div>
      ) : previewURL ? (
        <img
          src={previewURL}
          alt={alt}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="text-gray-400 text-[10px] font-medium uppercase tracking-tighter">
          No Image
        </span>
      )}
    </button>
  );
};
