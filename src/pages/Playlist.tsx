import React, { useContext, useEffect, useState } from "react";
import {
  LoginContext,
  TokenContext,
  MessageContext,
  PlayContext,
} from "../utilities/context";
import useId from "../utilities/hooks/useID";
import SpotifyWebApi from "spotify-web-api-js";
import { Loading } from "../components/MainPageComponent/Loading";
import { PageBanner } from "../components/MainPageComponent/PageBanner";
import { TrackList } from "../components/MainPageComponent/TrackList";
import useInfiScroll from "../utilities/hooks/useInfiScroll";
import { SinglePlaylistResponse } from "../utilities/types";
import { PlaylistFunc } from "../components/MainPageComponent/PlaylistFunc";
import createRequest from "../utilities/createRequest";

interface PlaylistProps {}

// eslint-disable-next-line no-empty-pattern
export const Playlist: React.FC<PlaylistProps> = () => {
  const id = useId("playlist");
  const loggedIn = useContext(LoginContext);
  const token = useContext(TokenContext);
  const setMessage = useContext(MessageContext);
  const updatePlayer = useContext(PlayContext);
  const [tracks, setTracks] = useState<any[]>([]);
  const [, setPlaylists] = useState<SpotifyApi.PlaylistObjectSimplified[]>([]);
  const [like, setLike] = useState(false);
  const [loading, setLoading] = useState(true);
  const spotifyApi = new SpotifyWebApi();
  const [setNext, lastRef] = useInfiScroll(setTracks);
  const [total, setTotal] = useState(0);
  const [uri, setURI] = useState("");

  const [bannerInfo, setBannerInfo] = useState<SinglePlaylistResponse>({
    name: "",
    description: "",
    primary_color: "#262626",
    user: [],
    followers: 0,
    images: [],
    release_date: "",
    total: 0,
  });

  useEffect(() => {
    const [playSource, makeRequest] = createRequest(`https://api.spotify.com/v1/playlists/${id}`)
    if (id) {
      makeRequest()
        .then((data) => {
          const {
            name,
            description,
            owner,
            followers,
            tracks,
            images,
            uri,
          } = data;
          setBannerInfo((bannerInfo) => ({
            ...bannerInfo,
            name,
            description,
            user: [owner],
            followers,
            images: images,
          }));
          setTracks(tracks.items.map((track: any) => track.track));
          setNext(tracks.next);
          setURI(uri);
          setTotal(data.tracks.total);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          setMessage(`ERROR: ${error}`);
        });
    }

    if (token) {
      spotifyApi.setAccessToken(token);
      spotifyApi.getUserPlaylists().then(
        function (data) {
          setPlaylists(data.items);
          if (loggedIn && id) {
            const playlistsID = data.items.map((playlist) => playlist.id);
            if (playlistsID.includes(id)) {
              setLike(true);
            }
          }
        },
        function (error) {
          setMessage(`ERROR: ${error}`);
        }
      );
    }
    return () => {
      playSource.cancel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, loggedIn]);

  const refreshPlaylist = () => {
    spotifyApi.setAccessToken(token);
    spotifyApi.getUserPlaylists().then(
      function (data) {
        console.log(id);
        setPlaylists(data.items);
      },
      function (error) {
        setMessage(`ERROR: ${error}`);
      }
    );
  };

  const followPlaylist = () => {
    spotifyApi.setAccessToken(token);
    if (!like) {
      spotifyApi
        .followPlaylist(id)
        .then((response) => {
          setMessage("Added to your Library");
          setLike(!like);
          setTimeout(() => refreshPlaylist(), 500);
        })
        .catch((error) => {
          setMessage(`ERROR: ${error}`);
        });
    } else {
      spotifyApi
        .unfollowPlaylist(id)
        .then((response) => {
          setMessage("Removed from your Library");
          setLike(!like);
          setTimeout(() => refreshPlaylist(), 500);
        })
        .catch((error) => {
          setMessage(`ERROR: ${error}`);
        });
    }
  };

  const playPlaylist = () => {
    const body = {
      context_uri: uri,
    };
    spotifyApi.setAccessToken(token);
    spotifyApi
      .play(body)
      .then((response) => {
        setTimeout(() => updatePlayer(), 500);
      })
      .catch((error) => setMessage(`ERROR: ${error}`));
  };

  const playTrack = (trackURI: string) => {
    const body = {
      context_uri: uri,
      offset: { uri: trackURI },
    };
    spotifyApi.setAccessToken(token);
    spotifyApi
      .play(body)
      .then((response) => {
        setTimeout(() => updatePlayer(), 500);
      })
      .catch((error) => setMessage(`ERROR: ${error}`));
  };

  return loading ? (
    <Loading type="playlist" />
  ) : (
    <div
      className="listPage"
      style={{ display: `${tracks.length === 0 ? "none" : "block"}` }}
    >
      <PageBanner
        title="playlist"
        bannerInfo={bannerInfo}
        totalTracks={total}
      />
      <div className="playListContent">
        <div
          className="playListOverlay"
          style={{ backgroundColor: `${bannerInfo.primary_color}` }}
        ></div>
        <PlaylistFunc
          onFollow={followPlaylist}
          follow={like}
          setMessage={setMessage}
          playContext={playPlaylist}
        />
        <div className="page-content">
          <TrackList
            ref={lastRef}
            tracks={tracks}
            playContextTrack={playTrack}
          />
        </div>
      </div>
    </div>
  );
};
