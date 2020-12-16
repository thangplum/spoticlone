import React, { useContext, useEffect, useState } from 'react'
import SpotifyWebApi from 'spotify-web-api-js';
import { Loading } from '../components/MainPageComponent/Loading';
import { UserContext, TokenContext, LoginContext, MessageContext } from '../utilities/context';
import useId from '../utilities/hooks/useID';
import axios from 'axios';
import createRequest from '../utilities/createRequest';
import requestWithToken from '../utilities/requestWithToken';
import { CollectionRow } from '../components/MainPageComponent/CollectionRow';
import { PageBanner } from '../components/MainPageComponent/PageBanner';
import { PlaylistFunc } from '../components/MainPageComponent/PlaylistFunc';

interface UserProps {

}

export const User: React.FC<UserProps> = ({}) => {
  const id = useId();
  const user = useContext(UserContext)
  const token = useContext(TokenContext)
  const loggedIn = useContext(LoginContext)
  const setMessage = useContext(MessageContext)
  const [loading, setLoading] = useState(true);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [follow, setFollow] = useState(false);

  const [bannerInfo, setBannerInfo] = useState({
    name: '',
    description: '',
    user: [],
    followers: 0,
    primary_color: 'rgb(83, 83, 83)',
    images: [],
    release_date: '',
    total: 0
  });
  const source = axios.CancelToken.source();
  const spotifyApi = new SpotifyWebApi();
  
  useEffect(() => {
    const [userSource, requestUser] = createRequest(`https://api.spotify.com/v1/users/${id}`)
    const [listSource, requestList] = createRequest(`https://api.spotify.com/v1/users/${id}/playlists`)

    const makeRequest = async ()=> {
      try{
        const [userData, listData] = await Promise.all([requestUser(), requestList()])
        console.log(userData)
        console.log(listData)
        const {display_name, followers, images} = userData;
        const {items, total} = listData;
        setBannerInfo({...bannerInfo, name:display_name, followers: followers.total, images, total});
        setPlaylists(items);
        setLoading(false);
      }
      catch(error){ 
        setMessage(`ERROR: ${error}`);
        setLoading(false);
      }   
    }

    if (id){
      makeRequest()
    }
    
    if (loggedIn && id){
      const requestFollow = requestWithToken(`https://api.spotify.com/v1/me/following/contains?type=user&ids=${id}`, token, source)
      requestFollow()
        .then(response => {
            setFollow(response.data[0])
        })
        .catch(error => console.log(error))
    }

    return () => {
      userSource.cancel()
      listSource.cancel()
      source.cancel()
    }
  }, [id])

  const followUser = () => {
    if (loggedIn) {
      spotifyApi.setAccessToken(token);
      if (follow) {
        spotifyApi.unfollowUsers([id])
          .then(response => {
            setFollow(!follow);
          })
          .catch(error => setMessage(`ERROR: ${error}`))
      } else {
        spotifyApi.followUsers([id])
          .then(response => {
            setFollow(!follow);
          })
          .catch(error => setMessage(`ERROR: ${error}`))
      }
    }
  }

  return (
    loading
    ? <Loading type='user' />
    : <div className='listPage' style={{display: playlists.length===0? 'none':'block'}}>
        <PageBanner title='profile' bannerInfo={bannerInfo} totalTracks={0} />
        <div className="playListContent">
            <div className="playListOverlay" style={{backgroundColor: `${bannerInfo.primary_color}`}}></div>
            <PlaylistFunc type={id === user.id ? 'none' : 'user'} follow={follow} onFollow={followUser} setMessage={setMessage}/>
            <div className="page-content" style={{marginTop: '40px'}}>
                <CollectionRow name='Public Playlists' id={null} playlists={playlists}/>
            </div>
        </div>
    </div>
  );
}