import {
  OptionItem,
  type OptionItemProps,
} from "@/shared/ui/OptionItem/OptionItem";

type OptionType = "myPost" | "myComment" | "others";

type OptionVariant = NonNullable<OptionItemProps["variant"]>;

interface OptionListProps {
  mode: OptionType;
  onEdit?: () => void;
}

const Type_MAP: Record<OptionType, OptionVariant[]> = {
  myPost: ["delete"],
  myComment: ["edit", "delete"],
  others: ["report"],
};

export const OptionList = ({ mode, onEdit }: OptionListProps) => {
  const options = Type_MAP[mode];
  return (
    <div className="w-fit flex flex-col rounded-xl overflow-hidden shadow-sm">
      {options.map((opt) => (
        <OptionItem
          key={opt}
          variant={opt}
          onClick={() => {
            if (opt === "edit" && onEdit) {
              onEdit();
            }
          }}
        />
      ))}
    </div>
  );
};
