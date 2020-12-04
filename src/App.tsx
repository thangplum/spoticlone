import React, { useEffect, useRef, useState } from 'react';
import Axios from 'axios';
import SpotifyWebApi from 'spotify-web-api-js';
import Sidebar from './components/SidebarComponent/Sidebar';
import { getHashParams } from './utilities/getHashParams';
import { LoginContext, UserContext, userContext, USER_CONTEXT_DEFAULT, TokenContext, LinkContext } from './utilities/context'
import { MainPage } from './components/MainPageComponent/MainPage';
import { Footer } from './components/FooterComponent/Footer';
import { Banner } from './components/FooterComponent/Banner';
import { Player } from './components/FooterComponent/Player';
import { Loading } from './components/MainPageComponent/Loading';

function App() {
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState("");
  const [loggedIn, setLogin] = useState(false);
  const [user, setUser] = useState<userContext>(USER_CONTEXT_DEFAULT)
  const [playlists, setPlaylists] = useState<SpotifyApi.PlaylistObjectSimplified[]>([]);
  const spotifyApi = new SpotifyWebApi();

  useEffect(() => {
    
    const params = getHashParams();
    const access_token = params.access_token;
    const error = params.error;
    
    if (error) {
      console.log(error);
      setLoading(false);
    } else {
      if (access_token) {
        spotifyApi.setAccessToken(access_token);
        setLogin(true);
        setToken(access_token);
        window.location.hash = ''
        //fetch playlists
        spotifyApi.getUserPlaylists().
          then(
            function(data) {
              setPlaylists(data.items);
            },
            function(err) {
              console.log(err);
            }
          )
        
        //fetch user account information
        spotifyApi.getMe()
            .then(
              function(data) {
                //cast response type to local type
                setUser(data as userContext)
              },
              function(err) {
                console.log(err)
              }
            )
        setLoading(false);
      } else {
        Axios(`${process.env.REACT_APP_BACK_URI}/refresh_token`, {withCredentials: true})
          .then((response) => {
            const access_token = response.data.access_token
            setToken(access_token);
            setLogin(true);
            spotifyApi.setAccessToken(access_token);
            spotifyApi.getUserPlaylists().
              then(
                function(data) {
                  setPlaylists(data.items);
                },
                function(err) {
                  console.log(err);
                }
              )
          
            //fetch user account information
            spotifyApi.getMe()
              .then(
                function(data) {
                  //cast response type to local type
                  setUser(data as userContext);
                },
                function(err) {
                  console.log(err);
                }
              )
            setLoading(false);
          })
          .catch((error) => {
            console.log(error);
            setLoading(false);
            return ;
          })
      }
    }

    return ;
  }, [])
  
  // TODO: 
  // 2. Continue to do player
  return (
      <div className="App">
        {loading 
          ? <Loading type='app' />
          : <LoginContext.Provider value={loggedIn}>
              <Sidebar playlists={playlists} />
              <UserContext.Provider value={user}>
                <TokenContext.Provider value={token}>
                  <MainPage />
                </TokenContext.Provider>
              </UserContext.Provider>
              {/* TODO: Add a functional player */}
              <Footer>
                {loggedIn ? <Player token={token} /> : <Banner />}
              </Footer>
            </LoginContext.Provider>
        }
      </div>
  );
}

export default App;
