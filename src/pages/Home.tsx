import React, { useEffect, useState, useContext } from 'react'
import { CollectionRow } from '../components/MainPageComponent/CollectionRow';
import SpotifyWebApi from 'spotify-web-api-js';
import { LoginContext } from '../utilities/context';
import { getHashParams } from '../utilities/getHashParams';
import PrevTrack from '../icons/PrevTrack';

interface HomeProps {

}

interface track {

}

export const Home: React.FC<HomeProps> = ({}) => {
    const [recentlyPlaylist, setRecentlyPlaylist] = useState<SpotifyApi.TrackObjectSimplified[]>([]);
    const [newReleases, setNewReleases] = useState<any[]>([]);
    const [topTracksAndArtists, setTop] = useState<any[]>([]);
    const loggedIn = useContext(LoginContext);
    const spotifyApi = new SpotifyWebApi();

    // console.log(spotifyApi.getMyRecentlyPlayedTracks());
    useEffect(() => {
        const params = getHashParams();
        const topTracksAndArtistsList: any[] = []
        const token = params.access_token;
        if (token) {
            spotifyApi.setAccessToken(token);

            spotifyApi.getNewReleases().
                then (
                    function(data) {
                        setNewReleases(data.albums.items as any)
                    },
                    function(err) {
                        console.log(err);
                    }
                )

            spotifyApi.getMyRecentlyPlayedTracks().
                then (
                    function(data) {
                        const recentlyPlaylistList: SpotifyApi.TrackObjectSimplified[] = [];
                        data.items.map((track, index) => {
                            recentlyPlaylistList.push(track.track as SpotifyApi.TrackObjectSimplified);
                        })
                        setRecentlyPlaylist(recentlyPlaylistList);
                    },
                    function(err) {
                        console.log(err);
                    }
                )
            spotifyApi.getMyTopTracks().
                then (
                    function(data) {
                        data.items.slice(0, 5).map((track, index) => {
                            setTop(prevTop => ([...prevTop, track]));
                        });
                    },
                    function(err) {
                        console.log(err);
                    }
                )
            spotifyApi.getMyTopArtists().
                then (
                    function(data) {
                        // console.log(data);
                        data.items.slice(0, 5).map((artist, index) => {
                            setTop(prevTop => ([...prevTop, artist]));
                        });
                    },
                    function(err) {
                        console.log(err);
                    }
                )
        }
    }, [])

    useEffect(() => { 
        topTracksAndArtists.sort((a, b) => (a.popularity > b.popularity) ? -1 : 1);
        console.log(topTracksAndArtists) 
    }, [topTracksAndArtists])

    return (
        <div className="page-content">
            <div className='pageContent'>
                {loggedIn 
                ?   <>
                        <CollectionRow name='Recently played' id={null} playlists={recentlyPlaylist} />
                        <CollectionRow name='Jump back in' id={null} playlists={topTracksAndArtists} description={"Your top listens from the past few months."} />
                        <CollectionRow name='New releases for you' id={null} playlists={newReleases} />
                    </>
                :   <div></div>
                }
                
            </div>
        </div>
    );
}