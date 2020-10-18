import React from 'react'
import { FeaturedPlaylists } from './Playlists/FeaturedPlaylists';

interface PlayListProps {

}

export const PlayList: React.FC<PlayListProps> = ({}) => {
    return (
        <div className="playlists">
            <h1 className="play-title">playlists</h1>
            <FeaturedPlaylists />
            <hr className="list-separator" />
        </div>
    );
}
