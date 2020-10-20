import React, { useEffect, useState } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import Sidebar from './components/Sidebar';
import { getHashParams } from './utilities/getHashParams';

// function fetchSong(setNowPlaying: React.Dispatch<React.SetStateAction<nowPlayingSong>>): void {
//   spotifyApi.getMyCurrentPlayingTrack()
//     .then(response => {
//       if (!response) {
//         console.log("Cannot fetch");
//       }
//       console.log(response);
//       setNowPlaying({name: response.item?.name!, albumArt: response.item?.album.images[0].url!});
//       return response.item;
//     })
// }



function App() {
  const [token, setToken] = useState("");
  const [loggedIn, setLogIn] = useState(false);
  // const [nowPlaying, setNowPlaying] = useState({name: 'Not Checked', albumArt: ''} as nowPlayingSong);
  const [playlists, setPlaylists] = useState<SpotifyApi.PlaylistObjectSimplified[]>([]);

  useEffect(() => {
    const spotifyApi = new SpotifyWebApi();
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
      
    }
  })
  
  
  
  return (
    <div className="App">
      { !loggedIn && <a href='http://localhost:8888'>Login to Spotify</a>}
      <Sidebar playlists={playlists} />
      {/* <div>
        Now Playing: { nowPlaying.name }
      </div>
      <div>
        <img src={ nowPlaying.albumArt } style={{ height: 150 }}/>
      </div>
      { loggedIn &&
        <button onClick={() => fetchSong(setNowPlaying)}>
          Check Now Playing
        </button>
      } */}
    </div>
  );
}

export default App;
