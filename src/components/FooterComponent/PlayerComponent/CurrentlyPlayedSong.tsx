import React, { useContext } from "react";
import Icon from "../../../icons";
import { MessageContext } from "../../../utilities/context";

interface CurrentlyPlayedSongProps {
  playingSongInfo: any;
}

export const CurrentlyPlayedSong: React.FC<CurrentlyPlayedSongProps> = ({
  playingSongInfo,
}) => {
  if (playingSongInfo.type === "track") {
    const { album, artists, name, id } = playingSongInfo;
    let imageUrl;
    if (album.images && album.images.length !== 0) {
      imageUrl = album.images[album.images.length - 1].url;
    }
    return (
      <div className="now-playing">
        <div className="player-cover">
          {imageUrl ? (
            <img draggable="false" loading="eager" src={imageUrl} alt=""></img>
          ) : (
            <div>
              <Icon name="Music2" />
            </div>
          )}
        </div>

        <div
          className="player-info"
          style={{ display: name === "" ? "none" : "" }}
        >
          <div className="player-info-track ellipsis-one-line">
            <a href={`/album/${album.id}?highlight=${id}`}>{name}</a>
          </div>

          <div className="player-info-artist ellipsis-one-line">
            {artists.map((artist: any, index: number) => {
              return (
                <a href={artist.external_urls.spotify} key={index}>
                  {artist.name}
                </a>
              );
            })}
          </div>
        </div>

        <div
          className="player-like"
          style={{ display: name === "" ? "none" : "" }}
        >
          <button
            title="Save to your Liked Songs"
            className="player-like-button no-outline"
          >
            <Icon name="Heart" />
          </button>
        </div>
      </div>
    );
  } else if (playingSongInfo.type === 'episode') {
    const { images, id, name, external_urls, show } = playingSongInfo;
    console.log(playingSongInfo)
    let imageUrl;
    if (images && images.length > 0) {
      imageUrl = images[images.length - 1].url;
    }
    return (
      <div className="now-playing">
        <div className="player-cover">
          {imageUrl ? (
            <img draggable="false" loading="eager" src={imageUrl} alt=""></img>
          ) : (
            <div>
              <Icon name="Music2" />
            </div>
          )}
        </div>
        <div
          className="player-info"
          style={{ display: name === "" ? "none" : "" }}
        >
          <div className="player-info-track ellipsis-one-line">
            <a href={external_urls ? external_urls.spotify : `/episode/${id}`}>{name}</a>
          </div>
          <div className="player-info-artist ellipsis-one-line">
            {show
              ? <a href={show.external_urls.spotify}>{show.name}</a>
              : <></>
            }
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className="now-playing">
        <div className="player-cover">
          <div>
            <Icon name="Music2" />
          </div>
        </div>
      </div>
    )
  }
};
