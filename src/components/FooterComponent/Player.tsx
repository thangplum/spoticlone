import React, { useEffect, useState } from 'react'
import SpotifyWebApi from 'spotify-web-api-js';
import { getHashParams } from '../../utilities/getHashParams';
import { ControlButton } from './PlayerComponent/ControlButton';
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
                    <div className="player-center">
                        <div className="player-control-buttons">
                            <ControlButton
                                title="Toggle Shuffle"
                                icon="Shuffle"
                               
                            />
                            <ControlButton
                                title="Previous"
                                icon="PrevTrack"
                                size="x-smaller"
                                
                            />
                            <ControlButton
                                
                                title="Pause"
                                icon="Pause" 
                                size="smaller" 
                                extraClass="circle-border"
                                
                            />
                            <ControlButton
                                title="Next"
                                icon="NextTrack"
                                size="x-smaller"
                                
                            />
                            <ControlButton
                                title="Toggle Repeat"
                                icon="Repeat"
                                
                            />
                        </div>

                    </div>
                </div> : <></>
            }
        </>
    );
}