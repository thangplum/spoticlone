import React from 'react'
import { FeaturedPlaylists } from './Playlists/FeaturedPlaylists';
import SpotifyWebApi from 'spotify-web-api-js';
import { NormalPlaylists } from './Playlists/NormalPlaylists';

interface PlayListProps {
    playlists: SpotifyApi.PlaylistObjectSimplified[]
}

export const PlayList: React.FC<PlayListProps> = ({ playlists }) => {
    return (
        <div className="playlists">
            <h1 className="play-title">playlists</h1>
            <FeaturedPlaylists />
            <hr className="list-separator" />
            <NormalPlaylists playlists={playlists} />
        </div>
    );
}
