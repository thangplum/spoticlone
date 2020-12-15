import { release } from 'os';
import React, { useContext } from 'react'
import Icon from '../../icons';
import { MessageContext, PlayContext } from '../../utilities/context';
import msTimeFormat from '../../utilities/timeFormat';

interface EpisodeListItemProps {
  show: any;
  playContextTrack: (uri: string) => void;
  ref?: (node: HTMLLIElement | null) => void
}

export const EpisodeListItem = React.forwardRef<HTMLLIElement, EpisodeListItemProps>(({show, playContextTrack}, ref) => {
  const updatePlayer = useContext(PlayContext);
  
  const {description, images, name, release_date, uri, duration_ms} = show;
  const setMessage = useContext(MessageContext);
  const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let shortenDescription = '';

  if (show.description.length > 200) {
    shortenDescription = description.substring(0, 200);
    shortenDescription = description.substring(0, Math.min(shortenDescription.length, shortenDescription.lastIndexOf(' '))) + '...';
  } else{
    shortenDescription = description;
  }
  
  let parsedDate = new Date(Date.parse(release_date));
  return (
    <li ref={ref} className="showListItem">
      <div className="verticalBorder">
        <div className="showInfoWrap">
          <div className="showThumbnailContainer">
            <img loading="lazy" src={images[1].url} className="showThumbnail" alt=""></img>
          </div>
          <div className="showTitleContainer">
            <h3 className="showTitle">{name}</h3>
            <p style={{paddingLeft: "20px"}}>{shortenDescription}</p>
            <div className="additionalOptions">
              <button className="smallPlayButton no-outline" title="Play" data-tip='play' data-for='tooltipMain' data-event='click' onClick={() => {
                playContextTrack(uri)
                setTimeout(() => updatePlayer(), 500)
              }}>
                <Icon name="Play" height='16' width='16'/>
              </button>
              <p>{`${month[parsedDate.getMonth()]} ${parsedDate.getDate()}`}</p>
              <p>{msTimeFormat(duration_ms)}</p>
              <button className="smallMoreButton no-outline" title="More" onClick={() => setMessage('Oops looks like I decide not too implement this')}>• • •</button>
            </div>
          </div>
        </div>  
      </div>
    </li>
  );
})