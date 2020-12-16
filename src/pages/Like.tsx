import React, { useContext, useEffect, useState } from 'react'
import SpotifyWebApi from 'spotify-web-api-js';
import { PageBanner } from '../components/MainPageComponent/PageBanner';
import { PlaylistFunc } from '../components/MainPageComponent/PlaylistFunc';
import { TrackList } from '../components/MainPageComponent/TrackList';
import { TokenContext, UserContext } from '../utilities/context';
import { useLoadScroll } from '../utilities/hooks/useLoadScroll';
import axios from "axios";
import { SinglePlaylistResponse } from '../utilities/types';
interface LikeProps {

}

export const Like: React.FC<LikeProps> = () => {
    const [likedTracks, setLikedTracks] = useState<SpotifyApi.SavedTrackObject[]>([]);
    const [numTracks,setNumTracks] = useState(0);
    const spotifyApi = new SpotifyWebApi();
    const token = useContext(TokenContext);
    const user = useContext(UserContext);
    const source = axios.CancelToken.source();
    const [setNext, lastRef] = useLoadScroll(setLikedTracks, token, source);


    const bannerInfo = {
      name: 'Liked Songs',
      description: '',
      user: [user],
      followers: 0,
      primary_color: 'rgb(70, 62, 118)',
      images: [{url: 'https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png'}],
      release_date: '',
      total: 0
    } as SinglePlaylistResponse;

    useEffect(() => {
        if (token) {
            spotifyApi.setAccessToken(token);

            spotifyApi.getMySavedTracks()
                .then(
                    function(data) {
                        setLikedTracks(data.items);
                        setNumTracks(data.total);
                        setNext(data.next);
                    },
                    function(error) {
                        console.log(error);
                    }
                )
        }
    }, [])

    const playTracks = (trackURI: string) => {
        const track_uri = likedTracks.map((track) => {
          return track.track.uri;
        })
        const uris = {
            'uris': track_uri
        }
        spotifyApi.setAccessToken(token);
        spotifyApi.play(uris)
            .catch((error) => {
                console.log(error);
            })
    }

    const playTrack = (trackURI: string) => {
        const body = {
            uris: [trackURI]
        }
        spotifyApi.setAccessToken(token);
        spotifyApi.play(body)
            .catch((error) => {
                console.log(error);
            })
    }

    return (
        <div className='listPage' style={{display: `${likedTracks.length === 0 ? 'none':'block'}`}}>
            <PageBanner title={'playlist'} bannerInfo={bannerInfo} totalTracks={numTracks} /> 
            <div className="playListContent">
                <div className="playListOverlay" style={{backgroundColor: `${bannerInfo.primary_color}`}} />
                <PlaylistFunc type='playOnly' playContext={playTracks} />
                <div className="page-content">
                    <TrackList ref={lastRef} tracks={likedTracks} playContextTrack={playTrack} styleName="simplify" />
                </div>
            </div>
        </div>
    );
}