import {
  useRef,
  useState,
  useEffect,
  type HTMLAttributes,
  type ChangeEvent,
  type MouseEvent,
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
  onClick,
  ...props
}: ProfilePictureProps) => {
  const [localPreviewURL, setLocalPreviewURL] = useState<string | null>(null);
  const [prevProps, setPrevProps] = useState({ imgURL, isEditing });
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (imgURL !== prevProps.imgURL || isEditing !== prevProps.isEditing) {
    setPrevProps({ imgURL, isEditing });

    if (imgURL !== prevProps.imgURL) {
      setLocalPreviewURL(null);
    }
  }

  useEffect(() => {
    return () => {
      if (localPreviewURL?.startsWith("blob:")) {
        URL.revokeObjectURL(localPreviewURL);
      }
    };
  }, [localPreviewURL]);

  const handleContainerClick = (e: MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLocalPreviewURL(url);
      onImageChange?.(file);
    }
    e.target.value = "";
  };

  const displayURL = localPreviewURL ?? imgURL;

  return (
    <>
      <button
        type="button"
        onClick={handleContainerClick}
        disabled={!isEditing}
        aria-label={isEditing ? "프로필 사진 변경" : alt}
        className={cn(
          "bg-background-dark flex size-[78px] shrink-0 items-center justify-center overflow-hidden rounded-full transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600",
          (!displayURL || isEditing) && "border border-border-deactivated",
          isEditing ? "cursor-pointer hover:opacity-80" : "cursor-default",
          className,
        )}
        {...props}
      >
        {isEditing ? (
          <div className="relative flex h-full w-full items-center justify-center">
            {displayURL && (
              <img
                src={displayURL}
                alt={alt}
                className="absolute inset-0 h-full w-full object-cover opacity-40"
              />
            )}
            <ImagePlus className="text-gray-400 relative z-10 size-6" />
          </div>
        ) : displayURL ? (
          <img
            src={displayURL}
            alt={alt}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-gray-400 text-[10px] font-medium uppercase tracking-tighter">
            No Image
          </span>
        )}
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
        tabIndex={-1}
        aria-hidden="true"
      />
    </>
  );
};
