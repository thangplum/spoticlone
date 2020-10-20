import React from 'react'
import SpotifyWebApi from 'spotify-web-api-js';
import { ListItem } from './ListItem';

interface NormalPlaylistsProps {
    playlists: SpotifyApi.PlaylistObjectSimplified[]
}

export const NormalPlaylists: React.FC<NormalPlaylistsProps> = ({playlists}) => {

    return (
        <div className="other-playlist-container">
            <ul className="other-list">
                {playlists.map((playlist) => <ListItem key={playlist.id} name={playlist.name} id={playlist.id}/>)}
            </ul>
        </div>
    );
}