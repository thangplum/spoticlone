import React, { useContext, useEffect, useState } from 'react'
import SpotifyWebApi from 'spotify-web-api-js';
import { TokenContext, LoginContext, MessageContext, PlayContext } from '../utilities/context';
import createRequest from '../utilities/createRequest';
import useId from '../utilities/hooks/useID';
import getLocale from '../utilities/locale';
import axios from 'axios';
import requestWithToken from '../utilities/requestWithToken';
import { Loading } from '../components/MainPageComponent/Loading';
import { PageBanner } from '../components/MainPageComponent/PageBanner';
import { PlaylistFunc } from '../components/MainPageComponent/PlaylistFunc';
import { AboutMenu } from '../components/MainPageComponent/AboutMenu';

interface ArtistProps {

}

export const Artist: React.FC<ArtistProps> = () => {
  const spotifyApi = new SpotifyWebApi();
  const id = useId('artist');
  const token = useContext(TokenContext);
  const loggedIn = useContext(LoginContext);
  const setMessage = useContext(MessageContext);
  const [loading, setLoading] = useState(true);
  const [tracks, setTracks] = useState<any[]>([]);
  const [album, setAlbum] = useState<any[]>([]);
  const [single, setSingle] = useState<any[]>([]);
  const [appear, setAppear] = useState<any[]>([]);
  const [compilation, setCompilation] = useState<any[]>([]);
  const [related, setRelated] = useState<any[]>([]);
  const [follow, setFollow] = useState(false);
  const [uri, setUri] = useState('');
  const [, locale] = getLocale();
  const [bannerInfo, setBannerInfo] = useState<any>({
    name: '',
    description: '',
    primary_color: 'rgb(83, 83, 83)',
    user: [],
    followers: 0,
    images: [],
    release_date: '',
    total: 0
  })
  const updatePlayer = useContext(PlayContext);
  const source = axios.CancelToken.source()

  useEffect(() => {
    setTracks([])
    setAlbum([])
    setSingle([])
    setAppear([])
    setCompilation([])
    setRelated([])
    setFollow(false)
    setUri('')
    setLoading(true)
    
    const [artistSource, requestArtist] = createRequest(`https://api.spotify.com/v1/artists/${id}`);
    const [tracksSource, requestTracks] = createRequest(`https://api.spotify.com/v1/artists/${id}/top-tracks?country=${locale}`);
    const [albumSource, requestAlbum] = createRequest(`https://api.spotify.com/v1/artists/${id}/albums?include_groups=album&country=${locale}`);
    const [singleSource, requestSingle] = createRequest(`https://api.spotify.com/v1/artists/${id}/albums?include_groups=single&country=${locale}`);
    const [appearSource, requestAppear] = createRequest(`https://api.spotify.com/v1/artists/${id}/albums?include_groups=appears_on&country=${locale}`);
    const [compilationSource, requestCompilation] = createRequest(`https://api.spotify.com/v1/artists/${id}/albums?include_groups=compilation&country=${locale}`);
    const [relatedSource, requestRelated] = createRequest(`https://api.spotify.com/v1/artists/${id}/related-artists`);

    if (loggedIn && token) {
      const requestFollow = requestWithToken(`https://api.spotify.com/v1/me/following/contains?type=artist&ids=${id}`, token, source)
        requestFollow()
          .then(response => {
            setFollow(response.data[0])
          })
          .catch(error => console.log(error))
    }

    const makeRequest = async () => {
      try {
        const [
          artistData,
          trackData,
          albumData,
          singleData,
          appearData,
          compliationData,
          relatedData
        ] = await Promise.all([requestArtist(), requestTracks(), requestAlbum(), requestSingle(), requestAppear(), requestCompilation(),
        requestRelated()]);
        const {name, followers, primary_color, images, uri} = artistData;
        setBannerInfo({...bannerInfo, name: name, followers: followers.total, primary_color, images});
        setUri(uri);
       
        const newTracks = trackData.tracks.length > 5? trackData.tracks.slice(0,5) : trackData.tracks;
        const newAlbum = albumData.items;
        const newSingle = singleData.items;
        const newAppear = appearData.items;
        const newCompilation = compliationData.items;
        const newRelated = relatedData.artists;

        setTracks([...tracks, ...newTracks]);
        setAlbum([...album, ...newAlbum]);
        setSingle([...single, ...newSingle]);
        setAppear([...appear, ...newAppear]);
        setCompilation([...compilation, ...newCompilation]);
        setRelated([...related, ...newRelated]);
        setLoading(false);
      }
      catch(error) {
        console.log(error)
        setLoading(false)
      }
    }

    if (id){
      makeRequest()
    }

    return () => {
      artistSource.cancel();
      tracksSource.cancel();
      albumSource.cancel();
      singleSource.cancel();
      appearSource.cancel();
      compilationSource.cancel();
      relatedSource.cancel();
      source.cancel();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const followArtist = () => {
    spotifyApi.setAccessToken(token);
    if (!follow) {
      spotifyApi.followArtists([id])
        .then((response) => {
          setMessage('Unsaved from your collection');
          setFollow(!follow);
        })
        .catch((error) => setMessage(`ERROR: ${error}`))
    } else {
      spotifyApi.unfollowArtists([id])
        .then((response) => {
          setMessage('Saved to your collection');
          setFollow(!follow);
        })
        .catch((error) => setMessage(`ERROR: ${error}`))
    }
  }

  const playPlaylist = () => {
    const body = {
      context_uri: uri
    }
    spotifyApi.setAccessToken(token);
    spotifyApi.play(body)
      .then((response) => {
        setTimeout(() => updatePlayer(), 500)
      })
      .catch((error) => setMessage(`ERROR: ${error}`))
  }

  const playTrack = (trackURI: string) => {
    const body = {
      uris: [trackURI]
    }
    spotifyApi.setAccessToken(token);
    spotifyApi.play(body)
      .then((response) => {
        setTimeout(() => updatePlayer(), 500)
      })
      .catch((error) => setMessage(`ERROR: ${error}`))
  }
  
  return (
    loading 
    ? <Loading type='artist' /> 
    : <div className='listPage' style={{display: tracks.length===0? 'none':'block'}}>
        <PageBanner title='artist' bannerInfo={bannerInfo} totalTracks={0}/>
        <div className="playListContent">
            <div className="playListOverlay" style={{backgroundColor: `${bannerInfo.primary_color}`}}></div>
            <PlaylistFunc type='artist' follow={follow} onFollow={followArtist} setMessage={setMessage} playContext={playPlaylist}/>
            <div className="page-content">
                <AboutMenu id={id} related = {related} tracks={tracks} album={album} single={single} appear={appear} compliation={compilation} playTrack={playTrack}/>
            </div>
        </div>
    </div>
  );
}