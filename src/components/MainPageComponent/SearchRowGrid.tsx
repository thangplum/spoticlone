import React from "react";
import { PlayCard } from "./PlayCard";

interface SearchRowGridProps {
  info: any;
  type: string;
}

export const SearchRowGrid: React.FC<SearchRowGridProps> = ({ type, info }) => {
  return (
    <div className="RowGrid">
      {info.map((item: any) => {
        return <PlayCard key={item.id} info={item} type={type} />;
      })}
    </div>
  );
};
