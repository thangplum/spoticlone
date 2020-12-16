import React, { useContext, useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import { Episodes } from "../components/MainPageComponent/Episodes";
import { Loading } from "../components/MainPageComponent/Loading";
import { PageBanner } from "../components/MainPageComponent/PageBanner";
import { PlaylistFunc } from "../components/MainPageComponent/PlaylistFunc";
import {
  TokenContext,
  MessageContext,
  PlayContext
} from "../utilities/context";
import createRequest from "../utilities/createRequest";
import useId from "../utilities/hooks/useID";
import useInfiScroll from "../utilities/hooks/useInfiScroll";
import getLocale from "../utilities/locale";

interface PodcastProps {}

export const Podcast: React.FC<PodcastProps> = () => {
  const id = useId("show");
  const [loading, setLoading] = useState(true);
  const token = useContext(TokenContext);
  const setMessage = useContext(MessageContext);
  const updatePlayer = useContext(PlayContext);
  const spotifyApi = new SpotifyWebApi();
  const [shows, setShows] = useState<any[]>([]);
  const [, lastRef] = useInfiScroll(setShows);
  const [totalTracks, setTotalTracks] = useState(0);
  const [uri, setURI] = useState("");
  const [bannerInfo, setBannerInfo] = useState<any>({
    name: "",
    description: "",
    primary_color: "rgb(83, 83, 83)",
    publishers: "",
    followers: 0,
    images: [],
    release_date: "",
    total: 0,
  });
  const [follow, ] = useState(true);
  const [description, setDescription] = useState("");
  const [, locale] = getLocale();

  useEffect(() => {
    const [source, makeRequest] = createRequest(`https://api.spotify.com/v1/shows/${id}?market=${locale.toLowerCase()}`)
    if (id) {
      makeRequest()
        .then((data) => {
          const {
            name,
            description,
            images,
            publisher,
            episodes,
            total_episodes,
            uri,
          } = data;
          setBannerInfo({
            ...bannerInfo,
            name,
            description,
            publisher: publisher,
            images,
          });
          setTotalTracks(total_episodes);
          setShows(episodes.items);
          setURI(uri);
          setDescription(description);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          setMessage(`ERROR: ${error}`);
        });
    }
    return () => {
      source.cancel();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const playShow = () => {
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

  const playEpisode = (trackURI: string) => {
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
    <Loading type="show" />
  ) : (
    <div
      className="listPage"
      style={{ display: shows.length === 0 ? "none" : "block" }}
    >
      <PageBanner
        title="podcast"
        bannerInfo={bannerInfo}
        totalTracks={totalTracks}
      />
      <div className="playListContent">
        <div
          className="playListOverlay"
          style={{ backgroundColor: `${bannerInfo.primary_color}` }}
        ></div>
        <PlaylistFunc
          type="artist"
          follow={follow}
          onFollow={() =>
            setMessage(
              "Oops looks like the Spotify API does not support following podcast"
            )
          }
          setMessage={setMessage}
          playContext={playShow}
        />
        <div className="pod-content">
          <Episodes
            ref={lastRef}
            shows={shows}
            description={description}
            playContextTrack={playEpisode}
          />
        </div>
      </div>
    </div>
  );
};
