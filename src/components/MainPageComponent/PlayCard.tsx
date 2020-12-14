import React, { useContext } from 'react'
import { Link, useHistory } from 'react-router-dom';
import SpotifyWebApi from 'spotify-web-api-js';
import Icon from '../../icons';
import { TokenContext, LoginContext, PlayContext } from '../../utilities/context';
import { CardDisplay } from './CardDisplay';
import { CardInfo } from './CardInfo';

interface PlayCardProps {
    info: any,
    type: string
}

function returnDescription(type:string, info:any){
    let artists
    switch (type){
        case 'playlist':
           return info.description || `By ${info.owner.display_name}`;
        case 'album':
            artists = info.artists.map((object:any) => object.name);
            return artists.length === 1 ? artists[0]:artists.join(', ');
        case 'artist':
            return 'Artist'
        case 'track':
            artists = info.artists.map((object:any) => object.name);
            return artists.length === 1 ? artists[0]:artists.join(', ');
        case 'show':
            return info.publisher;
        default:
            return null
    }
}

export const PlayCard: React.FC<PlayCardProps> = ({info, type}) => {
    const history = useHistory();
    const description = returnDescription(type, info);
    const {name, id, uri} = info;
    const spotifyApi = new SpotifyWebApi();
    const token = useContext(TokenContext);
    const loggedIn = useContext(LoginContext);
    const updatePlayer = useContext(PlayContext);

    let images
    if (type === 'track'){
        images = info.album.images
    }else{
        images = info.images
    }
    let image_url
    try{
        image_url = images[0].url
    }catch{
        image_url = null 
    }

    const handlePlay = () => {
        if (uri) {
            let body;
            if (type === 'track') {
                body = {
                    uris: [uri]
                }
            } else {
                body = {
                    context_uri: uri
                }
            }
            spotifyApi.setAccessToken(token);

            spotifyApi.play(body)
                .then ((response) => {
                    setTimeout(() => updatePlayer(), 500)
                })
        } else {
            history.push(`/tracks`)
        }
    }
    
    return (
        <div className="pcWrapper">
            <Link to={info.to? info.to : type === 'track'? `/album/${info.album.id}?highlight=${id}`:`/${type}/${id}`} style={{textDecoration:'none', color:'var(--main-text)', zIndex:3}}>
                <div className="PlayCard">
                    <CardDisplay url={image_url} type={type}/>
                    <CardInfo title={name} description={description}/>
                </div>
            </Link>
            {loggedIn
                ?   <button className="smallButton no-outline" title="Play" onClick={() => {
                    handlePlay();
                    setTimeout(() => updatePlayer(), 500)
                }}>
                        <Icon name="Play" height='17' width='17'/>
                    </button>
                :   <button className="smallButton no-outline" title="Play" data-tip='play' data-for='tooltipMain' data-event='click'>
                        <Icon name="Play" height='17' width='17'/>
                    </button>
            }
            
        </div>
    );
}