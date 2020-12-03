import React, { useEffect, useState, useContext } from 'react'
import { CollectionRow } from '../components/MainPageComponent/CollectionRow';
import SpotifyWebApi from 'spotify-web-api-js';
import { LoginContext, TokenContext } from '../utilities/context';
import getLocale from '../utilities/locale';
import createRequest from '../utilities/createRequest';
import { create } from 'domain';

interface HomeProps {

}

export const Home: React.FC<HomeProps> = ({}) => {
    const [recentlyPlaylist, setRecentlyPlaylist] = useState<SpotifyApi.TrackObjectSimplified[]>([]);
    const [newReleases, setNewReleases] = useState<any[]>([]);
    const [topTracksAndArtists, setTop] = useState<any[]>([]);
    const [collections, setCollections] = useState<any[]>([]);
    const [tempPlaylists, setTempPlaylists] = useState<any>({});
    const [fpPlaylists, setFpPlaylists] = useState<any[]>([]);
    const loggedIn = useContext(LoginContext);
    const token = useContext(TokenContext);
    const spotifyApi = new SpotifyWebApi();

    useEffect(() => {
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
                        data.items.slice(0, 5).map((artist, index) => {
                            setTop(prevTop => ([...prevTop, artist]));
                        });
                    },
                    function(err) {
                        console.log(err);
                    }
                )
        } else {
            const [language, locale] = getLocale()
            const {source, makeRequest} = createRequest(`https://api.spotify.com/v1/browse/categories?limit=6&country=${locale}&locale=${language}_${locale}`)

            makeRequest()
                .then((data: any) => {
                    setCollections(data.categories.items);
                })
                .catch((error: any) => console.log(error))
            
            
            return () => source.cancel()
        }
    }, [token])

    useEffect(() => {
        collections.map((collection) => {
            const {name, id} = collection
            var rq = createRequest(`https://api.spotify.com/v1/browse/categories/${id}/playlists?limit=9`)
            rq.makeRequest()
                .then((data) => {
                    const playlists = data.playlists.items
                    setTempPlaylists(() => ({[name]: {id, playlists}}))
                })
                .catch((error) => console.log(error))
            return null
        })
    }, [collections])

    useEffect(() => { 
        topTracksAndArtists.sort((a, b) => (a.popularity > b.popularity) ? -1 : 1);
    }, [topTracksAndArtists])
    
    useEffect(() => {
        setFpPlaylists({...fpPlaylists, ...tempPlaylists});
        // setFpPlaylists([...fpPlaylists, tempPlaylists]);
    // eslint-disable-next-line
    }, [tempPlaylists])

    return (
        <div className="page-content">
            <div className='pageContent'>
                {loggedIn 
                ?   <>
                        <CollectionRow name='Recently played' id={null} playlists={recentlyPlaylist} />
                        <CollectionRow name='Jump back in' id={null} playlists={topTracksAndArtists} description={"Your top listens from the past few months."} />
                        <CollectionRow name='New releases for you' id={null} playlists={newReleases} />
                    </>
                :   <>
                        <CollectionRow name='Uniquely Yours' id={null} playlists={[{id:'', to:'/tracks', description:'', name:'Liked Songs', images:[{url: 'https://misc.scdn.co/liked-songs/liked-songs-300.png'}]}]}/>
                        {   
                            Object.entries(fpPlaylists).map(playlist => {
                                console.log(playlist);
                                return (
                                    <CollectionRow name={playlist[0]} key={playlist[1].id} id={playlist[1].id} playlists={playlist[1].playlists}/>
                                )
                            })
                        }
                    </>
                }
                
            </div>
        </div>
    );
}