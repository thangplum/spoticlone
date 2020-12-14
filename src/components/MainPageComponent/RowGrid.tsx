import React from 'react'
import { PlayCard } from './PlayCard';

interface RowGridProps {
  playlists: any[];
}

export const RowGrid: React.FC<RowGridProps> = ({playlists}) => {
  return (
    <div className="RowGrid">
      {playlists.map((playlist, index) => {
        return <PlayCard key={playlist.id} info={playlist} type={playlist.type}/>
      })}
    </div>
  );
}