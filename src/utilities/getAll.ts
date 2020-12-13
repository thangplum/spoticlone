import { CancelTokenSource } from 'axios';
import requestWithToken from './requestWithToken';

export async function getAll(next: string | null, setPlaylist: React.Dispatch<React.SetStateAction<SpotifyApi.PlaylistObjectSimplified[]>>, 
  token: string, source: CancelTokenSource, setNext: React.Dispatch<React.SetStateAction<string>>) {
  if (next !== null) {
    const req = requestWithToken(next, token, source);
    req()
      .then((response) => {
        console.log(response);
      })
      .catch((error) => error)
  }
}