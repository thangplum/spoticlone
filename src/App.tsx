import React, { useEffect, useRef, useState } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import Sidebar from './components/SidebarComponent/Sidebar';
import { getHashParams } from './utilities/getHashParams';
import { LoginContext, UserContext, userContext, USER_CONTEXT_DEFAULT, TokenContext } from './utilities/context'
import { MainPage } from './components/MainPageComponent/MainPage';

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
      { !loggedIn && <a href='http://localhost:8888'>Login to Spotify</a>}
      <LoginContext.Provider value={loggedIn}>
        <Sidebar playlists={playlists} />
      </LoginContext.Provider>
      <UserContext.Provider value={user}>
        <LoginContext.Provider value={loggedIn}>
          <TokenContext.Provider value={token}>
            <MainPage />
          </TokenContext.Provider>
        </LoginContext.Provider>
      </UserContext.Provider>
      
    </div>
  );
}

export default App;
