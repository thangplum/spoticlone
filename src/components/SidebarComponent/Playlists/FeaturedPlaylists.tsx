import React from "react";
import { CreatePlaylist } from "./CreatePlaylist";
import { FeaturedItem } from "./FeaturedItem";

interface FeaturedPlaylistsProps {}

export const FeaturedPlaylists: React.FC<FeaturedPlaylistsProps> = () => {
  return (
    <>
      <div className="featured-playlists">
        <CreatePlaylist />
        <FeaturedItem label="Liked Songs" />
      </div>
    </>
  );
};
