import React from "react";
import { ListItem } from "./ListItem";

interface NormalPlaylistsProps {
  playlists: SpotifyApi.PlaylistObjectSimplified[];
  ref: (node: HTMLLIElement) => void;
}

export const NormalPlaylists = React.forwardRef<
  HTMLLIElement,
  NormalPlaylistsProps
>(({ playlists }, ref) => {
  return (
    <div className="other-playlist-container">
      <ul className="other-list">
        {playlists.map((playlist, index) => {
          if (index + 1 === playlists.length) {
            return (
              <ListItem
                ref={ref}
                key={playlist.id}
                name={playlist.name}
                id={playlist.id}
              />
            );
          } else {
            return (
              <ListItem
                key={playlist.id}
                name={playlist.name}
                id={playlist.id}
              />
            );
          }
        })}
      </ul>
    </div>
  );
});
