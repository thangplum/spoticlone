import React, { useEffect, useState } from 'react'
import SpotifyWebApi from 'spotify-web-api-js';
import { getHashParams } from '../../utilities/getHashParams';
import { CurrentlyPlayedSong } from './PlayerComponent/CurrentlyPlayedSong';

interface PlayerProps {

}

export const Player: React.FC<PlayerProps> = ({}) => {
    const spotifyApi = new SpotifyWebApi();
    const [recentPlayedSong, setRecentPlayedSong] = useState({});

    useEffect(() => {
        const params = getHashParams();
        const token = params.access_token;

        if (token) {
            spotifyApi.setAccessToken(token);

            spotifyApi.getMyCurrentPlayingTrack().
                then (
                    function(data) {
                        console.log(data)
                    },
                    function(err) {
                        console.log(err);
                    }
                )  
                
            spotifyApi.getMyCurrentPlaybackState().
                then (
                    function(data) {
                        console.log(data)
                    },
                    function(err) {
                        console.log(err);
                    }
                ) 

            spotifyApi.getMyRecentlyPlayedTracks().
                then (
                    function(data) {
                        //console.log(data)
                        setRecentPlayedSong(data.items[0].track);
                    },
                    function(err) {
                        console.log(err);
                    }
                )
            
            spotifyApi.getMyCurrentPlaybackState().
                then (
                    function(data) {
                        console.log(data)
                        
                    },
                    function(err) {
                        console.log(err);
                    }
                )
        }
    }, [])

    return (
        <>
            {Object.keys(recentPlayedSong).length !== 0 ? 
                <div className="player">
                    <div className="player-left">
                        <CurrentlyPlayedSong playingSongInfo={recentPlayedSong} /> 
                    </div>
                </div> : <></>
            }
        </>
    );
}