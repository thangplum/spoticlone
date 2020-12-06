import React, { forwardRef, Ref, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react'
import SpotifyWebApi from 'spotify-web-api-js';
import { MessageContext, TokenContext } from '../../utilities/context';
import { getHashParams } from '../../utilities/getHashParams';
import { ConnectDevices } from './PlayerComponent/ConnectDevices';
import { ControlButton } from './PlayerComponent/ControlButton';
import { CurrentlyPlayedSong } from './PlayerComponent/CurrentlyPlayedSong';
import { ProgressBar } from './PlayerComponent/ProgressBar';
import {
    SpotifyPlayerCallback,
    WebPlaybackError,
    WebPlaybackPlayer
} from '../../utilities/types/spotify'

interface PlayerProps {
    token: string,
}

type PlayerHandle = {
    updateState: () => void
}

export const Player = forwardRef((props: PlayerProps, ref: Ref<PlayerHandle>) => {
    const { token } = props;
    const spotifyApi = new SpotifyWebApi();
    const [recentPlayedSong, setRecentPlayedSong] = useState({});
    const [connectTip, setConnectTip] = useState(false);
    const [volume, setVolume] = useState(1);
    const [playbackState, setPlaybackState] = useState({
		play: false,
		shuffle: false,
		repeat: false,
		progress: 0,
		total_time: 0,
    });
    const [playback,  setPlayback] = useState(0);
    const [playInfo, setPlayInfo] = useState<any>({
		album: {},
		artists: [],
		name: "",
		id: "",
    });
    
    const timerRef = useRef(0);
    let player : WebPlaybackPlayer;

    const setMessage = useContext(MessageContext);

    useEffect(() => {
        
    }, [])

    useEffect(() => {
        loadScript();
		apiUpdate();

        window.onSpotifyWebPlaybackSDKReady = () => playerInitialize();
        
        if (token) {
            spotifyApi.setAccessToken(token);  
            
            spotifyApi.getMyRecentlyPlayedTracks().
                then (
                    function(data) {
                        setRecentPlayedSong(data.items[0].track);
                    },
                    function(err) {
                        console.log(err);
                    }
                )
        }
        return () => {
			clearTimeout(timerRef.current);
			player.disconnect();
		};
    }, [])

    const loadScript = () => {
        console.log("test")
		const script = document.createElement("script");

		script.id = "spotify-player";
		script.type = "text/javascript";
		script.async = false;
		script.defer = true;
		script.src = "https://sdk.scdn.co/spotify-player.js";

		document.body.appendChild(script);
	};

    const playerInitialize = () => {
        console.log("player init");
        // @ts-ignore
		player = new window.Spotify.Player({
			name: "Spotify Clone Player",
			getOAuthToken: (cb: SpotifyPlayerCallback) => {
				cb(token);
			},
		});

		// Error handling
		player.addListener("initialization_error", (error: WebPlaybackError) => {
			setMessage(error.message);
		});
		player.addListener("authentication_error", (error: WebPlaybackError) => {
			setMessage(error.message);
		});
		player.addListener("account_error", (error: WebPlaybackError) => {
			setMessage(error.message);
		});
		player.addListener("playback_error", (error: WebPlaybackError) => {
			setMessage(error.message);
		});

		// Playback status updates
		player.addListener("player_state_changed", (state) => {
			console.log(state);
			try {
                if (state) {
                    const {
                        duration,
                        position,
                        paused,
                        shuffle,
                        repeat_mode,
                        track_window,
                    } = state;
                    const { current_track } = track_window;
    
                    setPlayInfo(current_track);
                    setPlayback(position / duration);
                    setPlaybackState((state) => ({
                        ...state,
                        play: !paused,
                        shuffle: shuffle,
                        repeat: repeat_mode !== 0,
                        progress: position,
                        total_time: duration,
                    }));
                }
			} catch (error) {
				console.log(error);
			}
		});

		// Ready
		player.addListener("ready", ({ device_id }) => {
			console.log("Ready with Device ID", device_id);
			const tipAccess = localStorage.getItem("tipAccess");
			if (!tipAccess) {
				localStorage.setItem("tipAccess", "true");
				setConnectTip(true);
			}
		});

		// Not Ready
		player.addListener("not_ready", ({ device_id }) => {
			console.log("Device ID has gone offline", device_id);
		});

		// Connect to the player!
		player.connect();
	};



    useImperativeHandle(ref, () => ({
		updateState: () => {
			setPlaybackState((state) => ({ ...state, play: true }));
			updateState();
		},
	}));

    //Use for other components to update the player state only if not connected to the web player
    const updateState = () => {
        if (!player.getCurrentState) {
            apiUpdate();
        }
    };

    const apiUpdate = () => {
        if (timerRef.current) {
			clearTimeout(timerRef.current);
		}
        spotifyApi.setAccessToken(token);
        spotifyApi.getMyCurrentPlaybackState()
            .then (
                function(data) {
                    if (Object.keys(data).length === 0) {
                        setMessage("There is no active device");
                        setConnectTip(true);
                    } else {
                        console.log(data);
                        const {
                            repeat_state,
						    shuffle_state,
						    is_playing,
						    progress_ms,
						    item,
						    device,
                        } = data;
                        // Assuming item in data is not null
                        setPlayback(progress_ms! / item!.duration_ms);

                        timerRef.current = window.setTimeout(
                            () => updateState(),
                            item!.duration_ms - progress_ms! + 10
                        );

                        setVolume(device!.volume_percent! / 100);
                        setPlaybackState({
                            ...playbackState,
                            play: is_playing,
                            shuffle: shuffle_state,
                            repeat: repeat_state !== "off",
                            progress: progress_ms === null ? 0 : progress_ms,
                            total_time: item!.duration_ms,
                        });
                        setPlayInfo(item!);
                    }
                },
                function(error) {
                    setMessage(
						`ERROR: server response with ${error}. Player feature is unavailable!`
					);
                }
            )
    };
    
    const updatePlayback = () => {
		const interval = 500 / playbackState.total_time;
		setPlayback((playback) => playback + interval);
		setPlaybackState((state) => ({ ...state, progress: state.progress + 500 }));
	};

    const syncVolume = (ratio: number) => {
        const newVolume = Math.round(ratio * 100);
        // Sync volume with playback on active device
        spotifyApi.setAccessToken(token);
        spotifyApi.setVolume(newVolume)
			.then((response) => {
                setVolume(ratio);
				console.log(response);
			})
			.catch((error) => console.log(error));
    };
    
    const toggleShuffle = () => {
        spotifyApi.setAccessToken(token);
        spotifyApi.setShuffle(!playbackState.shuffle)
            .then ((response) => {
                console.log(response);
                setPlaybackState((state) => ({ ...state, shuffle: !state.shuffle }));
            })
            .catch ((error) => {
                console.log(error);
            })
    }

    const handleScriptCreate = () => {
        console.log("Script created");
    }
    
    const handleScriptError = () => {
        console.log("Script error");
    }
    
    const handleScriptLoad = () => {
        console.log("Script loaded");
    }

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
                                active={playbackState.shuffle}
                                onClick={toggleShuffle}
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
                                    <ProgressBar
                                        extraClass="volume"
                                        value={volume}
                                        engageClass="engage"
                                        setValue={(ratio) => syncVolume(ratio)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div> : <></>
            }
        </>
    );
})