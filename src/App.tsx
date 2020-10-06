import React, { useState } from 'react';
import './App.css';
import SpotifyWebApi from 'spotify-web-api-js';

type param = {
  access_token: string
}

type nowPlayingSong = {
  name: string,
  albumArt: string
}

const spotifyApi = new SpotifyWebApi();

function fetchSong(setNowPlaying: React.Dispatch<React.SetStateAction<nowPlayingSong>>): void {
  spotifyApi.getMyCurrentPlayingTrack()
    .then(response => {
      if (!response) {
        console.log("Cannot fetch");
      }
      console.log(response);
      setNowPlaying({name: response.item?.name!, albumArt: response.item?.album.images[0].url!});
      return response.item;
    })
}

function getHashParams() {
  let hashParams = {} as param;
  var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
  e = r.exec(q)
  while (e) {
    hashParams[e[1] as keyof param] = decodeURIComponent(e[2]);
    e = r.exec(q);
  }
  return hashParams;
}


function App() {
  const params = getHashParams();
  
  const token = params.access_token;
  const [loggedIn, setLogIn] = useState(token ? true : false);
  const [nowPlaying, setNowPlaying] = useState({name: 'Not Checked', albumArt: ''} as nowPlayingSong);
  
  if (token) {
    spotifyApi.setAccessToken(token);
  }
  
  return (
    <div className="App">
      { !loggedIn && <a href='http://localhost:8888'>Login to Spotify</a>}
      
      <div>
        Now Playing: { nowPlaying.name }
      </div>
      <div>
        <img src={ nowPlaying.albumArt } style={{ height: 150 }}/>
      </div>
      { loggedIn &&
        <button onClick={() => fetchSong(setNowPlaying)}>
          Check Now Playing
        </button>
      }
    </div>
  );
}

export default App;
