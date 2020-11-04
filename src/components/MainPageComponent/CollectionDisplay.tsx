import React from 'react'

interface CollectionDisplayProps {
    playlists: any
}

export const CollectionDisplay = React.forwardRef<HTMLDivElement, CollectionDisplayProps>(({playlists}, ref) => {
        return (
            <div className="RowGrid">
                {playlists.map((playlist, index) => {
                    if (playlist){
                        if (index+1 < playlist.length){
                            return <PlayCard key={playlist.id} info={playlist} type={playlist.type}/> 
                        }else{
                            return <PlayCard ref={ref} key={playlist.id} info={playlist} type={playlist.type}/> 
                        }
                    }else{
                        return null
                    }
                })}
            </div>
        );
    }
  );