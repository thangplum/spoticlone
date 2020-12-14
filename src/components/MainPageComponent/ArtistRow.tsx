import React from 'react'
import { ArtistRowGrid } from './ArtistRowGrid';
import { ArtistRowTitle } from './ArtistRowTitle';
import { TrackList } from './TrackList';

interface ArtistRowProps {
  title: string;
  display: string;
  list: any[];
  playTrack?: (uri: string) => void;
}

export const ArtistRow: React.FC<ArtistRowProps> = ({title, display, list, playTrack}) => {
  if (list && list.length > 0) {
    return (
        <div>
            <ArtistRowTitle title={title}/>
            {display === 'list' 
              ? playTrack && <TrackList tracks={list} styleName='simplify' playContextTrack={playTrack}/> 
              :  <ArtistRowGrid list={list}/>}
        </div>
    );
}else{
    return null
}
}