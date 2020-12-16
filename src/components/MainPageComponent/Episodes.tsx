import React from "react";
import { EpisodeList } from "./EpisodeList";

interface EpisodesProps {
  shows: any[];
  description: string;
  ref: (node: HTMLLIElement) => void;
  playContextTrack: (uri: string) => void | undefined;
}

export const Episodes = React.forwardRef<HTMLLIElement, EpisodesProps>(
  ({ shows, description, playContextTrack }, ref) => {
    console.log(shows);

    return (
      <div style={{ position: "relative", display: "flex", flexWrap: "wrap" }}>
        <div className="episodeList">
          <h2 className="showListTitle">All Episodes</h2>
          <EpisodeList shows={shows} playContextTrack={playContextTrack} />
        </div>
        <div className="episodeAbout">
          <h2
            style={{ color: "white", fontSize: "25px", paddingBottom: "25px" }}
          >
            About
          </h2>
          <p style={{ fontSize: "15px" }}>{description}</p>
        </div>
      </div>
    );
  }
);
