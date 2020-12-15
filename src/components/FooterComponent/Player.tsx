import React, {
  forwardRef,
  Ref,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import SpotifyWebApi from "spotify-web-api-js";
import { MessageContext, TokenContext } from "../../utilities/context";
import { getHashParams } from "../../utilities/getHashParams";
import { ConnectDevices } from "./PlayerComponent/ConnectDevices";
import { ControlButton } from "./PlayerComponent/ControlButton";
import { CurrentlyPlayedSong } from "./PlayerComponent/CurrentlyPlayedSong";
import { ProgressBar } from "./PlayerComponent/ProgressBar";
import {
  SpotifyPlayerCallback,
  WebPlaybackError,
  WebPlaybackPlayer,
} from "../../utilities/types";
import timeFormat from "../../utilities/timeFormat";
import Heartbeat from "react-heartbeat";
import requestWithToken from "../../utilities/requestWithToken";
import axios from "axios";
import { connect } from "http2";

interface PlayerProps {
  token: string;
}

type PlayerHandle = {
  updateState: () => void;
};

export const Player = forwardRef(
  (props: PlayerProps, ref: Ref<PlayerHandle>) => {
    const { token } = props;
    const spotifyApi = new SpotifyWebApi();
    const [currPb, setCurrPb] = useState(0);
    const [connectTip, setConnectTip] = useState(false);
    const [volume, setVolume] = useState(1);
    const [playbackState, setPlaybackState] = useState({
      play: false,
      shuffle: false,
      repeat: "off",
      progress: 0,
      total_time: 0,
    });
    const [playback, setPlayback] = useState(0);
    const [playInfo, setPlayInfo] = useState<any>({
      type: '',
      album: {},
      artists: [],
      name: "",
      id: "",
    });
    const [recentlyPlayedTrack, setRecentlyPlayedTrack] = useState<any>({
      album: {},
      artists: [],
      name: "",
      id: "",
      duration_ms: 0,
    });
    const source = axios.CancelToken.source();
    const timerRef = useRef(0);
    let player: WebPlaybackPlayer;
    let displayPlayer = useRef(null);

    const setMessage = useContext(MessageContext);

    useEffect(() => {}, []);

    useEffect(() => {
      loadScript();
      apiUpdate();

      window.onSpotifyWebPlaybackSDKReady = () => playerInitialize();

      if (token) {
        spotifyApi.setAccessToken(token);

        spotifyApi.getMyRecentlyPlayedTracks().then(
          function (data) {
            setRecentlyPlayedTrack(data.items[0].track);
            //setRecentTrackTotalTime(data.items[0].track.duration_ms)
          },
          function (err) {
            console.log(err);
          }
        );
      }

      return () => {
        clearTimeout(timerRef.current);
        player.disconnect();
      };
    }, []);

    const loadScript = () => {
      const script = document.createElement("script");

      script.id = "spotify-player";
      script.type = "text/javascript";
      script.async = false;
      script.defer = true;
      script.src = "https://sdk.scdn.co/spotify-player.js";

      document.body.appendChild(script);
    };

    const playerInitialize = () => {
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
        try {
          if (state) {
            console.log(state);
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
              repeat:
                repeat_mode === 0
                  ? "off"
                  : repeat_mode === 1
                  ? "context"
                  : "track",
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
        const tipAccess = localStorage.getItem("tipAccess");
        if (!tipAccess) {
          localStorage.setItem("tipAccess", "true");
          setConnectTip(false);
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
      if (!displayPlayer.current && !player) {
        apiUpdate();
      }
    };

    const apiUpdate = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      const requestInfo = requestWithToken(
        "https://api.spotify.com/v1/me/player/currently-playing",
        token,
        source
      );
      requestInfo()
        .then((response) => {
          if (response.status === 200) {
            //Type handling between track and episode
            if (response.data.currently_playing_type === "episode") {
              console.log("fuck you spotify for making this so much difficult");
              const requestShow = requestWithToken(
                "https://api.spotify.com/v1/me/player?additional_types=episode",
                token,
                source
              );
              requestShow()
                .then((response) => {
                  if (response.status === 200) {
                    console.log(response)
                    const {
                      repeat_state,
                      shuffle_state,
                      is_playing,
                      progress_ms,
                      item,
                      device,
                    } = response.data;
                    setPlayback(progress_ms / item.duration_ms);
          
                    timerRef.current = window.setTimeout(
                      () => updateState(),
                      item.duration_ms - progress_ms + 10
                    );
          
                    setVolume(device.volume_percent / 100);
                    setPlaybackState({
                      ...playbackState,
                      play: is_playing,
                      shuffle: shuffle_state,
                      repeat: repeat_state,
                      progress: progress_ms,
                      total_time: item.duration_ms,
                    });
                    setPlayInfo(item);
                  } else if (response.status === 204) {
                    setMessage(
                      "Player is not working, select a device to start listening"
                    );
                    setConnectTip(true);
                  } else {
                    setMessage(
                      `ERROR: server response with ${response}. Player feature is unavailable!`
                    );
                  }
                })
                .catch((error) => {
                  console.log(error);
                })
            } else {
              spotifyApi.setAccessToken(token);
              spotifyApi.getMyCurrentPlaybackState().then(
                function (data) {
                  if (Object.keys(data).length === 0) {
                    setMessage("There is no active device");
                    // setConnectTip(true);
                  } else {
                    const {
                      repeat_state,
                      shuffle_state,
                      is_playing,
                      progress_ms,
                      item,
                      device,
                    } = data;
                    // Assuming item in data is not null
                    if (item) {
                      setPlayback(progress_ms! / item.duration_ms);

                      timerRef.current = window.setTimeout(
                        () => updateState(),
                        item.duration_ms - progress_ms! + 10
                      );

                      setVolume(device!.volume_percent! / 100);
                      setPlaybackState({
                        ...playbackState,
                        play: is_playing,
                        shuffle: shuffle_state,
                        repeat: repeat_state,
                        progress: progress_ms === null ? 0 : progress_ms,
                        total_time: item.duration_ms,
                      });
                      setPlayInfo(item);
                    }
                  }
                },
                function (error) {
                  setMessage(
                    `ERROR: server response with ${error}. Player feature is unavailable!`
                  );
                }
              );
            } 
          } else if (response.status === 204) {
            setMessage(
              "Player is not working, select a device to start listening"
            );
            setConnectTip(true);
          } else {
            setMessage(
              `ERROR: server response with ${response}. Player feature is unavailable!`
            );
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };

    const updatePlayback = () => {
      const interval = 500 / playbackState.total_time;
      setPlayback((playback) => playback + interval);
      setPlaybackState((state) => ({
        ...state,
        progress: state.progress + 500,
      }));
    };

    const syncPlayback = (ratio: number) => {
      const currTime = Math.round(ratio * playbackState.total_time);
      spotifyApi.setAccessToken(token);
      spotifyApi
        .seek(currTime)
        .then((response) => {
          setPlayback(ratio);
          setPlaybackState((state) => ({ ...state, progress: currTime }));
          updateState();
        })
        .catch((error) => {
          setMessage(`ERROR: ${error}`);
        });
      setCurrPb(0);
      console.log(playbackState);
    };

    const syncVolume = (ratio: number) => {
      const newVolume = Math.round(ratio * 100);
      // Sync volume with playback on active device
      spotifyApi.setAccessToken(token);
      spotifyApi
        .setVolume(newVolume)
        .then((response) => {
          setVolume(ratio);
        })
        .catch((error) => {
          setMessage(`ERROR: ${error}`);
        });
    };

    const shuffle = () => {
      spotifyApi.setAccessToken(token);
      spotifyApi
        .setShuffle(!playbackState.shuffle)
        .then((response) => {
          setPlaybackState((state) => ({ ...state, shuffle: !state.shuffle }));
          updateState();
        })
        .catch((error) => {
          setMessage(`ERROR: ${error}`);
        });
    };

    const prev = () => {
      spotifyApi.setAccessToken(token);
      spotifyApi
        .skipToPrevious()
        .then((response) => {
          apiUpdate();
        })
        .catch((error) => {
          setMessage(`ERROR: ${error}`);
        });
    };

    const next = () => {
      spotifyApi.setAccessToken(token);
      spotifyApi
        .skipToNext()
        .then((response) => {
          apiUpdate();
        })
        .catch((error) => {
          setMessage(`ERROR: ${error}`);
        });
    };

    const play = () => {
      spotifyApi.setAccessToken(token);
      if (playbackState.play) {
        spotifyApi
          .pause()
          .then((response) => {
            setPlaybackState((state) => ({ ...state, play: !state.play }));
            updateState();
          })
          .catch((error) => {
            setMessage(`ERROR: ${error}`);
          });
      } else {
        spotifyApi
          .play()
          .then((response) => {
            setPlaybackState((state) => ({ ...state, play: !state.play }));
            updateState();
          })
          .catch((error) => {
            setMessage(`ERROR: ${error}`);
          });
      }
    };

    const repeat = () => {
      spotifyApi.setAccessToken(token);
      if (playbackState.repeat === "off") {
        spotifyApi
          .setRepeat("context")
          .then((response) => {
            setPlaybackState((state) => ({ ...state, repeat: "context" }));
            updateState();
          })
          .then((error) => {
            setMessage(`ERROR: ${error}`);
          });
      } else if (playbackState.repeat === "context") {
        spotifyApi
          .setRepeat("track")
          .then((response) => {
            setPlaybackState((state) => ({ ...state, repeat: "track" }));
            updateState();
          })
          .then((error) => {
            setMessage(`ERROR: ${error}`);
          });
      } else if (playbackState.repeat === "track") {
        console.log("test");
        spotifyApi
          .setRepeat("off")
          .then((response) => {
            setPlaybackState((state) => ({ ...state, repeat: "off" }));
            updateState();
          })
          .then((error) => {
            setMessage(`ERROR: ${error}`);
          });
      }
    };

    const scrubPlayback = (ratio: number) => {
      const time = ratio * playbackState.total_time;
      setCurrPb(time);
    };

    return (
      <>
        {playbackState.play ? (
          <Heartbeat
            heartbeatFunction={updatePlayback}
            heartbeatInterval={500}
          />
        ) : null}
        <div className="player">
          <div className="player-left">
            <CurrentlyPlayedSong
              playingSongInfo={playInfo}
            />
          </div>
          <div className="player-center">
            <div className="player-control-buttons">
              <ControlButton
                title="Toggle Shuffle"
                icon="Shuffle"
                active={playbackState.shuffle}
                onClick={shuffle}
              />
              <ControlButton
                title="Previous"
                icon="PrevTrack"
                size="x-smaller"
                onClick={prev}
              />
              <ControlButton
                title={playbackState.play ? "Pause" : "Play"}
                icon={playbackState.play ? "Pause" : "Play"}
                size={playbackState.play ? "smaller" : "larger"}
                extraClass="circle-border"
                onClick={play}
              />
              <ControlButton
                title="Next"
                icon="NextTrack"
                size="x-smaller"
                onClick={next}
              />
              <ControlButton
                title="Toggle Repeat"
                icon="Repeat"
                onClick={repeat}
              />
            </div>
            <div className="player-playback" draggable="false">
              <div className="playback-time" draggable="false">
                {currPb > 0
                  ? timeFormat(currPb)
                  : timeFormat(playbackState.progress)}
              </div>
              <ProgressBar
                extraClass="playback"
                value={playback}
                engageClass="engage"
                setValue={(ratio) => syncPlayback(ratio)}
                scrubFunction={scrubPlayback}
              />
              <div className="playback-time" draggable="false">
                {playbackState.total_time !== 0
                  ? timeFormat(playbackState.total_time)
                  : timeFormat(recentlyPlayedTrack.duration_ms)}
              </div>
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
                  icon="Devices"
                  size="x-larger"
                  onClick={() => setConnectTip(!connectTip)}
                  active={playbackState.play}
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
        </div>
      </>
    );
  }
);
