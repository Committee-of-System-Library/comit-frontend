import Ori_nervous from "@/assets/Ori_nervous.svg";

interface NoSearchResultProps {
  searchWord: string;
}

export const NoSearchResult = ({ searchWord }: NoSearchResultProps) => {
  return (
    <div className="flex flex-col items-center pt-30  gap-3">
      <img src={Ori_nervous} alt="Ori" className="w-37.5 h-52.5 shrink-0" />
      <p className="text-subtitle-01 text-text-deactivated">
        {`'${searchWord}' 에 대한 검색 결과가 없습니다.`}
      </p>
    </div>
  );
};
