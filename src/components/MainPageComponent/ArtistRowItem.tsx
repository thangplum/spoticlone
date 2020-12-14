import React from 'react'
import Icon from '../../icons'

interface ArtistRowItemProps {
  info: any;
}

export const ArtistRowItem: React.FC<ArtistRowItemProps> = ({info}) => {
  //console.log(info);
  const {name, type, id, images} = info 
  let thumbNail 
  if (images && images.length > 0){
    thumbNail = images[0].url;
  }
  
  return (
      <div className='artistRowItem'>
        <a href={`/${type}/${id}`}>
          <div className='artistRowThumb'>
            {thumbNail? 
              <img loading="lazy" src={thumbNail} style={{width:'100%', height:'100%'}} alt="" />: 
              <div>
                  <Icon name='CD'/>
              </div>}
          </div>
        </a>
        <div className="artistRowName ellipsis-one-line">
          <a href={`/${type}/${id}`}>{name}</a>
        </div>
      </div>
  );
}