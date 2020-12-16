import React, { useContext, useEffect, useState } from 'react'
import SpotifyWebApi from 'spotify-web-api-js';
import { Episodes } from '../components/MainPageComponent/Episodes';
import { Loading } from '../components/MainPageComponent/Loading';
import { PageBanner } from '../components/MainPageComponent/PageBanner';
import { PlaylistFunc } from '../components/MainPageComponent/PlaylistFunc';
import { TokenContext, MessageContext, PlayContext, LoginContext } from '../utilities/context';
import useId from '../utilities/hooks/useID';
import useInfiScroll from '../utilities/hooks/useInfiScroll';

interface PodcastProps {

}

export const Podcast: React.FC<PodcastProps> = ({}) => {
  const id = useId('show');
  const [loading, setLoading] = useState(true);
  const token = useContext(TokenContext);
  const setMessage = useContext(MessageContext);
  const updatePlayer = useContext(PlayContext);
  const loggedIn = useContext(LoginContext);
  const spotifyApi = new SpotifyWebApi();
  const [shows, setShows] = useState<any[]>([]);
  const [setNext, lastRef] = useInfiScroll(setShows);
  const [totalTracks, setTotalTracks] = useState(0);
  const [uri, setURI] = useState('');
  const [bannerInfo, setBannerInfo] = useState<any>({
    name: '',
    description: '',
    primary_color: 'rgb(83, 83, 83)',
    publishers: '',
    followers: 0,
    images: [],
    release_date: '',
    total: 0
  })
  const [follow, setFollow] = useState(true);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (loggedIn && id) {
      spotifyApi.setAccessToken(token);
      spotifyApi.getShow(id)
        .then(
          function(data) {
            const {name, description, images, publisher, episodes, total_episodes, uri} = data as any;
            console.log(data)
            setBannerInfo({...bannerInfo, name, description, publisher: publisher, images})
            setTotalTracks(total_episodes);
            setShows(episodes.items);
            setURI(uri);
            setDescription(description);
            setLoading(false);
          },
          function(error) {
            console.log(error);
          }
        )
    }
  }, [id])

  const playShow = () => {
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

  const playEpisode = (trackURI: string) => {
    const body = {
      context_uri: uri,
      offset: {uri: trackURI}
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
    ? <Loading type='show' />
    : <div className='listPage' style={{display: shows.length===0? 'none':'block'}}>
        <PageBanner title='podcast' bannerInfo={bannerInfo} totalTracks={totalTracks} />
        <div className="playListContent">
          <div className="playListOverlay" style={{backgroundColor: `${bannerInfo.primary_color}`}}></div>
          <PlaylistFunc type='artist' follow={follow} onFollow={() => setMessage('Oops looks like the Spotify API does not support following podcast')} setMessage={setMessage} playContext={playShow}/>
          <div className="pod-content">
            <Episodes ref={lastRef} shows={shows} description={description} playContextTrack={playEpisode} />
          </div>
        </div>
      </div>
  );
}