import React from "react";
import { EpisodeListItem } from "./EpisodeListItem";

interface EpisodeListProps {
  shows: any[];
  playContextTrack: (uri: string) => void | undefined;
  ref: (node: HTMLLIElement) => void;
}

export const EpisodeList = React.forwardRef<HTMLLIElement, EpisodeListProps>(
  ({ shows, playContextTrack }, ref) => {
    console.log(shows);
    return (
      <div className="showListContainer">
        <ol style={{ width: "100%" }}>
          {shows.map((show, index) => {
            if (index + 1 === shows.length) {
              return (
                <EpisodeListItem
                  show={show}
                  ref={ref}
                  playContextTrack={playContextTrack}
                />
              );
            } else {
              return (
                <EpisodeListItem
                  show={show}
                  playContextTrack={playContextTrack}
                />
              );
            }
          })}
        </ol>
      </div>
    );
  }
);
