import React, { useContext, useEffect, useState } from 'react'
import SpotifyWebApi from 'spotify-web-api-js';
import { TokenContext } from '../../utilities/context';
import { getHashParams } from '../../utilities/getHashParams';
import { ConnectDevices } from './PlayerComponent/ConnectDevices';
import { ControlButton } from './PlayerComponent/ControlButton';
import { CurrentlyPlayedSong } from './PlayerComponent/CurrentlyPlayedSong';

interface PlayerProps {

}

export const Player: React.FC<PlayerProps> = ({}) => {
    const spotifyApi = new SpotifyWebApi();
    const [recentPlayedSong, setRecentPlayedSong] = useState({});
    const [connectTip, setConnectTip] = useState(false);
    const [volume, setVolume] = useState(1);
    const token = useContext(TokenContext);
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
                    <div className="player-right">
                        <div className="extra-controls">
                            <span className="connect-devices-wrapper">
                                {connectTip && (
                                    <ConnectDevices
                                        token={token}
                                        closeTip={() => setConnectTip(false)}
                                    />
                                )}
                                <ControlButton
                                    title="Devices"
                                    icon="Speaker"
                                    size="x-larger"
                                    onClick={() => setConnectTip(!connectTip)}
                                    // active={playbackState.play}
                                />
                            </span>

                            <div className="volume-control">
                                <ControlButton
                                    title="Volume"
                                    icon="Volume"
                                    size="x-larger"
                                    extraClass="volume"
                                />
                                <div style={{ width: "100%" }}>
                                    {/* <ProgressBar
                                        extraClass="volume"
                                        value={volume}
                                        engageClass="engage"
                                        setValue={(ratio) => seekVolume(ratio)}
                                    /> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div> : <></>
            }
        </>
    );
}