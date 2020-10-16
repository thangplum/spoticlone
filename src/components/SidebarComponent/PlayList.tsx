import React from 'react'

interface PlayListProps {

}

export const PlayList: React.FC<PlayListProps> = ({}) => {
    return (
        <div className="playlists">
            <h1 className="play-title">playlists</h1>
            <hr className="list-separator" />
        </div>
    );
}