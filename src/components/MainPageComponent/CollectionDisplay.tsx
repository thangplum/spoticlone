import React from 'react'
import { PlayCard } from './PlayCard';

interface CollectionDisplayProps {
    playlists: any
}

export const CollectionDisplay = React.forwardRef<HTMLDivElement, CollectionDisplayProps>(({playlists}, ref) => {
        return (
            <div className="RowGrid">
                {playlists.map((playlist: any, index: number) => {
                    if (playlist){
                        if (index < 6){
                            return <PlayCard key={playlist.id} info={playlist} type={playlist.type}/> 
                        }
                    }else{
                        return null
                    }
                })}
            </div>
        );
    }
  );