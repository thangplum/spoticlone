import React, { useEffect, useRef, useState } from 'react';
import Axios from 'axios';
import SpotifyWebApi from 'spotify-web-api-js';
import Sidebar from './components/SidebarComponent/Sidebar';
import { getHashParams } from './utilities/getHashParams';
import { LoginContext, UserContext, userContext, USER_CONTEXT_DEFAULT, TokenContext, LinkContext, MessageContext, PlayContext } from './utilities/context'
import { MainPage } from './components/MainPageComponent/MainPage';
import { Footer } from './components/FooterComponent/Footer';
import { Banner } from './components/FooterComponent/Banner';
import { Player } from './components/FooterComponent/Player';
import { Loading } from './components/MainPageComponent/Loading';

type PlayerHandle = {
  updateState: () => void
}

function App() {
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState("");
  const [loggedIn, setLogin] = useState(false);
  const [user, setUser] = useState<userContext>(USER_CONTEXT_DEFAULT)
  const [status, setStatus] = useState(false);
  const [message, setMessage] = useState('');
  

  const timerRef = useRef(0);

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
    return (() => {
      clearTimeout(timerRef.current);
    });
  }, [])

  const playerRef = useRef<PlayerHandle>(null);

  const updatePlayer = () => {
    if (playerRef.current) {
      playerRef.current.updateState();
    }
  }

  const setStatusMessage = (message: string) => {
    clearTimeout(timerRef.current)
    setStatus(true)
    setMessage(message)
    timerRef.current = window.setTimeout(() => {
      setStatus(false)
    }, 3000)
  }
  
  

  return (
      <div className="App">
        {loading 
          ? <Loading type='app' />
          : <MessageContext.Provider value={setStatusMessage}>
              <LoginContext.Provider value={loggedIn}>
                <TokenContext.Provider value={token}>
                  <Sidebar />

                  <PlayContext.Provider value={updatePlayer}>
                    <UserContext.Provider value={user}>
                      <MainPage message={message} status={status} />
                    </UserContext.Provider>
                  </PlayContext.Provider>
                </TokenContext.Provider>
                
                <Footer>
                  {loggedIn ? <Player token={token} ref={playerRef} /> : <Banner />}
                </Footer>
              </LoginContext.Provider>
            </MessageContext.Provider>
        }
      </div>
  );
}

export default App;
