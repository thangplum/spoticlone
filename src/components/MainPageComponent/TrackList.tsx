import React, { CSSProperties } from 'react'
import { TrackListItem } from './TrackListItem';

interface TrackListProps {
    tracks: SpotifyApi.SavedTrackObject[];
    styleName?: string;
    highlight?: string;
    playContextTrack: (uri: string) => void;
    ref: (node: HTMLLIElement) => void;
}


export const TrackList = React.forwardRef<HTMLLIElement, TrackListProps>(({tracks, styleName, highlight, playContextTrack}, ref) => {
    return (
        <div className="trackListContainer">
            <ol className="trackList">
                {tracks.map((track: SpotifyApi.SavedTrackObject, index) => {
                    if (index+1 < tracks.length){
                        return <TrackListItem track={track.track} key={track.track.id} styleName={styleName} highlight={track.track.id === highlight} playContextTrack={playContextTrack}/>
                    }else{
                        return <TrackListItem ref={ref} track={track.track} key={track.track.id} styleName={styleName} highlight={track.track.id === highlight} playContextTrack={playContextTrack}/>
                    }
                })}
            </ol>
        </div>
    );
})