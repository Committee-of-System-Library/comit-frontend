import {
  OptionItem,
  type OptionItemProps,
} from "@/shared/ui/OptionItem/OptionItem";

type OptionType = "mine" | "others";

type OptionVariant = NonNullable<OptionItemProps["variant"]>;

interface OptionListProps {
  mode: OptionType;
}

const Type_MAP: Record<OptionType, OptionVariant[]> = {
  mine: ["edit", "delete"],
  others: ["report"],
};

export const OptionList = ({ mode }: OptionListProps) => {
  const options = Type_MAP[mode];
  return (
    <div className="w-fit flex flex-col rounded-xl overflow-hidden shadow-sm">
      {options.map((opt) => (
        <OptionItem key={opt} variant={opt} />
      ))}
    </div>
  );
};
