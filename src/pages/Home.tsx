import React, { useEffect, useState, useContext } from 'react'
import { CollectionRow } from '../components/MainPageComponent/CollectionRow';
import SpotifyWebApi from 'spotify-web-api-js';
import { LoginContext } from '../utilities/context';
import { getHashParams } from '../utilities/getHashParams';

interface HomeProps {

}


export const Home: React.FC<HomeProps> = ({}) => {
    const [recentlyPlaylist, setRecentlyPlaylist] = useState([]);
    const loggedIn = useContext(LoginContext);
    const spotifyApi = new SpotifyWebApi();
    
    // console.log(spotifyApi.getMyRecentlyPlayedTracks());
    useEffect(() => {
        const params = getHashParams();
    
        const token = params.access_token;
        if (token) {
            console.log(token)
            spotifyApi.setAccessToken(token);

            spotifyApi.getMyRecentlyPlayedTracks().
                then (
                    function(data) {
                        console.log("Personalized");
                        console.log(data);
                        setRecentlyPlaylist(data.items as any)
                    },
                    function(err) {
                        console.log(err);
                    }
                )
        }
    }, [])
    return (
        <div className="page-content">
            <div className='pageContent'>
                {loggedIn 
                ? <CollectionRow name='Recently played' id={null} playlists={recentlyPlaylist} />
                : <div></div>
                }
                
            </div>
        </div>
    );
}