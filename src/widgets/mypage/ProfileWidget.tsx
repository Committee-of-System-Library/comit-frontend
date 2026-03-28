import { useState } from "react";

import { ProfilePicture } from "@/shared/ui/ProfilePicture/ProfilePicture";
import { UserNameInput } from "@/shared/ui/UserNameInput/UserNameInput";
import { cn } from "@/utils/cn";

interface ProfileWidgetProps {
  initialUserName: string;
  major: string;
  studentId: string;
  imgURL?: string | null;
  className?: string;
}

export const ProfileWidget = ({
  initialUserName,
  major,
  studentId,
  imgURL,
  className,
}: ProfileWidgetProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState(initialUserName);

  const handleEditToggle = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div
      className={cn(
        "bg-background-light border-border-deactivated flex w-[384px] shrink-0 items-center justify-between rounded-xl border p-4 shadow-sm",
        className,
      )}
    >
      <div className="flex flex-1 items-center gap-4 min-w-0">
        <ProfilePicture imgURL={imgURL} isEditing={isEditing} />
        <div className="flex flex-col gap-1 min-w-0">
          {isEditing ? (
            <div className="w-[152px]">
              <UserNameInput
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
          ) : (
            <span className="text-text-primary text-label-01 h-[34px] flex items-center px-1 truncate font-bold">
              {userName}
            </span>
          )}
          <div className="text-text-secondary text-label-04 flex items-center gap-1 px-1 whitespace-nowrap">
            <span>{major}</span>
            <span>·</span>
            <span>{studentId}</span>
          </div>
        </div>
      </div>

      <div className="ml-4 shrink-0">
        {isEditing ? (
          <button
            type="button"
            onClick={handleSave}
            className="text-info-02 text-label-03 cursor-pointer whitespace-nowrap font-bold hover:opacity-80 transition-all"
          >
            변경사항 저장
          </button>
        ) : (
          <button
            type="button"
            onClick={handleEditToggle}
            className="text-info-02 text-label-03 cursor-pointer whitespace-nowrap font-bold hover:opacity-80 transition-all"
          >
            프로필 편집
          </button>
        )}
      </div>
    </div>
  );
};
