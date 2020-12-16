import React, { useContext, useEffect, useState } from "react";
import { Route } from "react-router-dom";
import SpotifyWebApi from "spotify-web-api-js";
import { CollectionTitle } from "../components/MainPageComponent/CollectionTitle";
import { PlayCard } from "../components/MainPageComponent/PlayCard";
import { TokenContext } from "../utilities/context";

interface CollectionProps {}

export const Collection: React.FC<CollectionProps> = () => {
  const [playlists, setPlaylists] = useState<
    SpotifyApi.PlaylistObjectSimplified[]
  >([]);
  const [artists, setArtists] = useState<SpotifyApi.ArtistObjectFull[]>([]);
  const [albums, setAlbums] = useState<SpotifyApi.SavedAlbumObject[]>([]);
  const [podcasts, setPodcasts] = useState<SpotifyApi.ShowObjectSimplified[]>(
    []
  );

  const token = useContext(TokenContext);
  const spotifyApi = new SpotifyWebApi();

  useEffect(() => {
    if (token) {
      spotifyApi.setAccessToken(token);

      spotifyApi.getUserPlaylists().then(
        function (data) {
          setPlaylists(data.items);
        },
        function (error) {
          console.log(error);
        }
      );

      spotifyApi.getMySavedShows().then(
        function (data) {
          setPodcasts(data.items);
        },
        function (error) {
          console.log(error);
        }
      );

      spotifyApi.getFollowedArtists().then(
        function (data) {
          setArtists(data.artists.items);
        },
        function (error) {
          console.log(error);
        }
      );

      spotifyApi.getMySavedAlbums().then(
        function (data) {
          setAlbums(data.items);
        },
        function (error) {
          console.log(error);
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page-content" style={{ paddingTop: "16px" }}>
      <Route exact path="/collection/playlists">
        <CollectionTitle title="Playlists" />
        <div className="browseGrid">
          {playlists.map((playlist) => {
            return (
              <PlayCard
                key={playlist.id}
                info={playlist}
                type={playlist.type}
              />
            );
          })}
        </div>
      </Route>
      <Route exact path="/collection/podcasts">
        <CollectionTitle title="Podcasts" />
        <div className="browseGrid">
          {podcasts.map((podcast: any) => {
            return (
              <PlayCard
                key={podcast.show.id}
                info={podcast.show}
                type={podcast.show.type}
              />
            );
          })}
        </div>
      </Route>
      <Route exact path="/collection/artists">
        <CollectionTitle title="Podcasts" />
        <div className="browseGrid">
          {artists.map((artist) => {
            return (
              <PlayCard key={artist.id} info={artist} type={artist.type} />
            );
          })}
        </div>
      </Route>
      <Route exact path="/collection/albums">
        <div className="browseGrid">
          {albums.map((album) => {
            return (
              <PlayCard
                key={album.album.id}
                info={album.album}
                type={album.album.type}
              />
            );
          })}
        </div>
      </Route>
    </div>
  );
};
