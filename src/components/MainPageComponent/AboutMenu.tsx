import React from 'react'
import { Route } from 'react-router-dom';
import { ArtistRow } from './ArtistRow';
import { CollectionRow } from './CollectionRow';
import { RowGrid } from './RowGrid';

interface AboutMenuProps {
  id: string;
  related: any[];
  tracks:any[];
  album: any[];
  single: any[];
  appear: any[];
  compliation: any[];
  playTrack: (uri: string) => void;
}

export const AboutMenu: React.FC<AboutMenuProps> = ({id, related, tracks, album, single, appear, compliation, playTrack}) => {
  const discography = [...album, ...single];
  discography.sort(function(a, b) {
    return Date.parse(b.release_date) - Date.parse(a.release_date);
  })
  console.log(appear);
  return (
    <>
      <div style={{paddingTop: '1.5em', position:"relative"}}>
        <Route exact path={`/artist/${id}`}>
          <ArtistRow title='Popular' display='list' list={tracks} playTrack={playTrack} /> 
          <CollectionRow name='Discography' playlists={discography} id={null} />
          <CollectionRow name='Fans also like' playlists={related} id={null} />
          {appear.length > 0 && <CollectionRow name='Appears on' playlists={appear} id={null} />}
          {compliation.length > 0 && <ArtistRow title='Appears On' display='grid' list={compliation} />} 
        </Route>
        <Route exact path={`/artist/${id}/related`}>
          <RowGrid playlists={related}/>
        </Route>
    </div>
    </>
  );
}