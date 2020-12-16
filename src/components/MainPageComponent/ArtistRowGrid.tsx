import React from "react";
import { ArtistRowItem } from "./ArtistRowItem";

interface ArtistRowGridProps {
  list: any[];
}

export const ArtistRowGrid: React.FC<ArtistRowGridProps> = ({ list }) => {
  //console.log(list)
  return (
    <div className="ArtistRowGrid">
      {list.map((item, index) => {
        //console.log(item);
        return <ArtistRowItem key={index} info={item} />;
      })}
    </div>
  );
};
