import React from 'react';
import { CreatePlaylist } from './CreatePlaylist';

interface FeaturedPlaylistsProps {

}

export const FeaturedPlaylists: React.FC<FeaturedPlaylistsProps> = ({}) => {
    return (
        <>
            <div className="featured-playlists">
                <CreatePlaylist />
                
            </div>
        </>
    );
}