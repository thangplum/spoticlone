import React, { useEffect, useRef, useState } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import Sidebar from './components/SidebarComponent/Sidebar';
import { getHashParams } from './utilities/getHashParams';
import { LoginContext, UserContext, userContext, USER_CONTEXT_DEFAULT, TokenContext } from './utilities/context'
import { MainPage } from './components/MainPageComponent/MainPage';
import { Footer } from './components/FooterComponent/Footer';
import { Banner } from './components/FooterComponent/Banner';
import { Player } from './components/FooterComponent/Player'

function App() {
  const [token, setToken] = useState("");
  const [loggedIn, setLogIn] = useState(false);
  const [user, setUser] = useState<userContext>(USER_CONTEXT_DEFAULT)
  const [playlists, setPlaylists] = useState<SpotifyApi.PlaylistObjectSimplified[]>([]);
  const spotifyApi = new SpotifyWebApi();

  useEffect(() => {
    
    const params = getHashParams();
    
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
      setLogIn(true);
      setToken(token);

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
    }
  }, [])
  
  
  return (
    <div className="App">
      <LoginContext.Provider value={loggedIn}>
        <Sidebar playlists={playlists} />

        <UserContext.Provider value={user}>
          <TokenContext.Provider value={token}>
            <MainPage />
          </TokenContext.Provider>
        </UserContext.Provider>
        {/* TODO: Add a functional player */}
        <Footer>
          {loggedIn ? <Player /> : <Banner />}
        </Footer>
        
      </LoginContext.Provider>
    </div>
  );
}

export default App;
