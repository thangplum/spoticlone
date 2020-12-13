import React, { useContext, useEffect, useState } from 'react'
import { LoginContext, TokenContext, MessageContext, PlayContext } from '../utilities/context';
import useId from '../utilities/hooks/useID';
import SpotifyWebApi from 'spotify-web-api-js';
import { Loading } from '../components/MainPageComponent/Loading';
import { PageBanner } from '../components/MainPageComponent/PageBanner';
import { TrackList } from '../components/MainPageComponent/TrackList';
import useInfiScroll from '../utilities/hooks/useInfiScroll';
import { SinglePlaylistResponse } from '../utilities/types';

interface PlaylistProps {

}

// eslint-disable-next-line no-empty-pattern
export const Playlist: React.FC<PlaylistProps> = ({}) => {
  const id = useId('playlist');
  const loggedIn = useContext(LoginContext);
  const token = useContext(TokenContext);
  const setMessage = useContext(MessageContext);
  const updatePlayer = useContext(PlayContext);
  const [tracks, setTracks] = useState<any[]>([]);
  const [uri, setURI] = useState("");
  const [like, setLike] = useState(false);
  const [loading, setLoading] = useState(true);
  const spotifyApi = new SpotifyWebApi();
  const [setNext, lastRef] = useInfiScroll(setTracks);
  const [total,setTotal] = useState(0);
  const [playlists, setPlaylists] = useState([]);

  const [bannerInfo, setBannerInfo] = useState<SinglePlaylistResponse>({
    name: '',
    description: '',
    primary_color: '#262626',
    user: [],
    followers: 0,
    images: [],
    release_date: '',
    total: 0
  })

  useEffect(() => {
    setLike(false);
    setURI('');
    setBannerInfo({
      name: '',
      description: '',
      primary_color: '#262626',
      user: [],
      followers: 0,
      images: [],
      release_date: '',
      total: 0
    });
    setTracks([]);
    setLoading(true);
    if (id) {
      spotifyApi.getPlaylist(id)
        .then(
          function(data) {
            const {name, description, owner, followers, primary_color, tracks, images, uri} = data;
            if (primary_color === null) {
              setBannerInfo(bannerInfo => ({...bannerInfo, name, description, user: [owner], followers: followers.total, images} as SinglePlaylistResponse))
            } else {
              setBannerInfo(bannerInfo => ({...bannerInfo, name, description, primary_color, user: [owner], followers: followers.total, images} as SinglePlaylistResponse))
            }
            setTracks(tracks.items.map((track) => track));
            setNext(tracks.next || '');
            setURI(uri);
            setTotal(data.tracks.total);
            setLoading(false);
          },
          function(error) {
            console.log(error);
          }
        )
    }
    if (loggedIn && id) {
      if (token) {
        spotifyApi.setAccessToken(token);
        spotifyApi.getUserPlaylists()
          .then(
            function(data) {
              console.log(data);
            },
            function(error) {
              console.log(error);
            }
          )
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, loggedIn])
  return (
    loading? 
    <Loading type='playlist' />
    : 
    <div className='listPage' style={{display: `${tracks.length===0? 'none':'block'}`}}>
        <PageBanner title='playlist' bannerInfo={bannerInfo} totalTracks={total}/>
        <div className="playListContent">
            <div className="playListOverlay" style={{backgroundColor: `${bannerInfo.primary_color}`}}></div>
            {/* <PlayListFunctions onFollow={followPlaylist} follow={like} setMessage={setMessage} playContext={playContext}/>
            <div className="page-content">
                <TrackList ref={lastRef} tracks={tracks} playContextTrack={playContextTrack}/>
            </div> */}
        </div>
    </div>
  );
}