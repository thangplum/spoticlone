import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SpotifyWebApi from "spotify-web-api-js";
import { Loading } from "../components/MainPageComponent/Loading";
import { PageBanner } from "../components/MainPageComponent/PageBanner";
import { PlaylistFunc } from "../components/MainPageComponent/PlaylistFunc";
import { TrackList } from "../components/MainPageComponent/TrackList";
import {
  TokenContext,
  MessageContext,
  PlayContext,
} from "../utilities/context";
import useId from "../utilities/hooks/useID";
import useInfiScroll from "../utilities/hooks/useInfiScroll";
import { SingleAlbumResponse } from "../utilities/types";
import createRequest from "../utilities/createRequest";

interface AlbumProps {}

function useHighlight(){
  return new URLSearchParams(useLocation().search).get('highlight')
}

export const Album: React.FC<AlbumProps> = () => {
  const id = useId();
  const token = useContext(TokenContext);
  const setMessage = useContext(MessageContext);
  const updatePlayer = useContext(PlayContext);
  const [loading, setLoading] = useState(true);
  const [tracks, setTracks] = useState<SpotifyApi.TrackObjectSimplified[]>([]);
  const [uri, setUri] = useState("");
  const [totalTracks, setTotalTracks] = useState(0);
  const spotifyApi = new SpotifyWebApi();
  const [setNext, lastRef] = useInfiScroll(setTracks);
  const [bannerInfo, setBannerInfo] = useState<SingleAlbumResponse>({
    album_type: "",
    name: "",
    description: "",
    primary_color: "#262626",
    user: [],
    followers: 0,
    images: [],
    release_date: "",
    total: 0,
  });
  const highlight = useHighlight();

  useEffect(() => {
    const [source, makeRequest] = createRequest(`https://api.spotify.com/v1/albums/${id}`);
    if (id) {
      makeRequest()
        .then((data) => {
          const {
            album_type,
            name,
            artists,
            tracks,
            images,
            release_date,
            uri,
            total_tracks
          } = data;
          setBannerInfo((bannerInfo) => ({
            ...bannerInfo,
            album_type,
            name,
            user: artists,
            images: images,
            release_date,
          }));
          setTracks(tracks.items);
          setNext(tracks.next);
          setUri(uri);
          setTotalTracks(total_tracks);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          setMessage(`ERROR: ${error}`);
        });
    }
    return () => source.cancel()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const playAlbum = () => {
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
    <Loading type="album" />
  ) : (
    <div
      className="listPage"
      style={{ display: `${tracks.length === 0 ? "none" : "block"}` }}
    >
      <PageBanner
        title={bannerInfo.album_type}
        bannerInfo={bannerInfo}
        totalTracks={totalTracks}
      />
      <div className="playListContent">
        <div
          className="playListOverlay"
          style={{ backgroundColor: `${bannerInfo.primary_color}` }}
        ></div>
        <PlaylistFunc
          onFollow={() =>
            setMessage(
              "Oops looks like the Spotify API does not support following albums"
            )
          }
          setMessage={setMessage}
          playContext={playAlbum}
        />
        <div className="page-content">
          <TrackList
            ref={lastRef}
            highlight={highlight}
            tracks={tracks}
            playContextTrack={playTrack}
          />
        </div>
      </div>
    </div>
  );
};
