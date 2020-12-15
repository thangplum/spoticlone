import React from 'react'
import { TrackListItem } from './TrackListItem';

interface TrackListProps {
    tracks: any[];
    styleName?: string;
    highlight?: string | null;
    playContextTrack: (uri: string) => void | undefined;
    ref: (node: HTMLLIElement) => void;
}


export const TrackList = React.forwardRef<HTMLLIElement, TrackListProps>(({tracks, styleName, highlight, playContextTrack}, ref) => {
  console.log(tracks)
    return (
        <div className="trackListContainer">
            <ol className="trackList">
                {tracks.map((track: any, index) => {
                    if (index+1 < tracks.length){
                        return <TrackListItem track={track} key={track.id} styleName={styleName} highlight={track.id === highlight} playContextTrack={playContextTrack}/>
                    }else{
                        return <TrackListItem ref={ref} track={track} key={track.id} styleName={styleName} highlight={track.id === highlight} playContextTrack={playContextTrack}/>
                    }
                })}
            </ol>
        </div>
    );
})