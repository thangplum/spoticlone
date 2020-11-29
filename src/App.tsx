import React, { useEffect, useRef, useState } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import Sidebar from './components/SidebarComponent/Sidebar';
import { getHashParams } from './utilities/getHashParams';
import { LoginContext, UserContext, userContext, USER_CONTEXT_DEFAULT, TokenContext, LinkContext } from './utilities/context'
import { MainPage } from './components/MainPageComponent/MainPage';
import { Footer } from './components/FooterComponent/Footer';
import { Banner } from './components/FooterComponent/Banner';
import { Player } from './components/FooterComponent/Player'

function App() {
  const [token, setToken] = useState("");
  const [loggedIn, setLogIn] = useState(false);
  const [user, setUser] = useState<userContext>(USER_CONTEXT_DEFAULT)
  const [playlists, setPlaylists] = useState<SpotifyApi.PlaylistObjectSimplified[]>([]);
  const [link, setLink] = useState("")
  const spotifyApi = new SpotifyWebApi();

  useEffect(() => {
    
    const params = getHashParams();
    
    const token = params.access_token;
    const link = params.link;
    if (token) {
      spotifyApi.setAccessToken(token);
      setLogIn(true);
      setToken(token);
      setLink(link)
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
  
  // TODO: 
  // 1. Redo auth to populate the page with or without login
  // 2. Continue to do player
  // 3. Redo "Recently Played" and make it display album, playlist the track comes from
  return (
    <div className="App">
      <LoginContext.Provider value={loggedIn}>
        <LinkContext.Provider value={link}>
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
        </LinkContext.Provider>
        
        
      </LoginContext.Provider>
    </div>
  );
}

export default App;
