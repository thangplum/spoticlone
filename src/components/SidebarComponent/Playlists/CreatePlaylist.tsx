import React from 'react';
import Icon from '../../../icons';

interface CreatePlaylistProps {

}

export const CreatePlaylist: React.FC<CreatePlaylistProps> = ({}) => {
    return (
        <button className="create-button no-outline">
            <div className="playlist-icon">
                <Icon name='Create' />
            </div>
            <span className="featured-label">Create Playlist</span>
        </button>
    );
}