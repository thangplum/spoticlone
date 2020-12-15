import React from 'react'
import Icon from '../../icons';
import msTimeFormat from '../../utilities/timeFormat';
import { EpisodeList } from './EpisodeList';
import { TrackListItem } from './TrackListItem';

interface EpisodesProps {
  shows: any[];
  styleName?: string;
  highlight?: string | null;
  ref: (node: HTMLLIElement) => void;
  playContextTrack: (uri: string) => void | undefined;
}

export const Episodes = React.forwardRef<HTMLLIElement, EpisodesProps>(({shows, styleName, highlight, playContextTrack}, ref) => { 
  console.log(shows);

  return (
    <div style={{position: "relative", display: "flex", flexWrap: "wrap"}}>
      <div className="episodeList">
        <h2 className="showListTitle">All Episodes</h2>
        <EpisodeList shows={shows} playContextTrack={playContextTrack} />
      </div>
      <div className="episodeAbout">
        <h2 style={{color: 'white', fontSize: "25px"}}>About</h2>
      </div>
    </div>
  );
})