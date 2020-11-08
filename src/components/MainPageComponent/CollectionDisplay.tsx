import { AnyTxtRecord } from 'dns';
import React from 'react'
import { PlayCard } from './PlayCard';

interface CollectionDisplayProps {
    playlists: any
}

export const CollectionDisplay = React.forwardRef<HTMLDivElement, CollectionDisplayProps>(({playlists}, ref) => {
    const unique: string[] = [];
    let uniqueIndex = 0;
    return (
        <div className="RowGrid">
            {playlists.map((playlist: any, index: number) => {
                if (playlist){
                    if (uniqueIndex < 6 && unique.indexOf(playlist.track.name) === -1){
                        uniqueIndex++;
                        unique.push(playlist.track.name);
                        return <PlayCard key={playlist.id} info={playlist.track} type={playlist.track.type}/> 
                    }
                }else{
                    return null
                }
            })}
        </div>
    );
}
);