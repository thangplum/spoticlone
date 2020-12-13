import React, { useContext, useEffect, useState } from 'react'
import { FeaturedPlaylists } from './Playlists/FeaturedPlaylists';
import SpotifyWebApi from 'spotify-web-api-js';
import { NormalPlaylists } from './Playlists/NormalPlaylists';
import { TokenContext } from '../../utilities/context';
import { useLoadScroll } from '../../utilities/hooks/useLoadScroll';
import axios from  'axios';

interface PlayListProps {

}

export const PlayList: React.FC<PlayListProps> = () => {
  const [playlists, setPlaylists] = useState<SpotifyApi.PlaylistObjectSimplified[]>([]);
  const token = useContext(TokenContext);
  const source = axios.CancelToken.source();
  const spotifyApi = new SpotifyWebApi();

  const [setNext, lastRef] = useLoadScroll(setPlaylists, token, source);

  useEffect(() => {
    if (token) {
      spotifyApi.setAccessToken(token);
      spotifyApi.getUserPlaylists()
        .then(
          function(data) {
            console.log(data);
            setPlaylists(data.items);
            setNext(data.next);
          },
          function(error) {
            console.log(error);
          }
        )
    }
  }, []);

  return (
      <div className="playlists">
          <h1 className="play-title">playlists</h1>
          <FeaturedPlaylists />
          <hr className="list-separator" />
          <NormalPlaylists ref={lastRef} playlists={playlists} />
      </div>
  );
}
