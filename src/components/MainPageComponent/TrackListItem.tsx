import React, { CSSProperties, useContext } from 'react';
import Icon from '../../icons';
import { PlayContext } from '../../utilities/context';
import timeFormat from '../../utilities/timeFormat';

interface TrackListItemProps {
    track: SpotifyApi.TrackObjectFull;
    styleName?: string;
    highlight?: boolean;
    playContextTrack: (uri: string) => void;
    ref?: (node: HTMLLIElement | null) => void
}


const simplyStyle = {
	display: "flex",
	alignItems: "center",
	justifyContent: "flex-end",
} as CSSProperties;

export const TrackListItem = React.forwardRef<HTMLLIElement, TrackListItemProps>(({track, styleName, highlight, playContextTrack}, ref) => {
    const { album, artists, name, explicit, duration_ms, uri } = track;

    const updatePlayer = useContext(PlayContext);
    let thumbNail;
    if (styleName === "simplify" && album.images.length > 0) {
        thumbNail = album.images[album.images.length - 1].url;
    }
    const formattedTime = timeFormat(duration_ms);
    return (
        <li
            ref={ref}
            className={`trackListItem ${highlight ? "highlight" : "none"}`}
        >
            <div
                className="trackItemPlay"
                style={styleName === "simplify" ? simplyStyle : undefined}
            >
                <button
                    className={
                        styleName === "simplify"
                            ? "hoverIcon no-outline"
                            : "hoverIcon trackTopAlign no-outline"
                    }
                    onClick={() => {
                        playContextTrack(uri);
                        updatePlayer();
                    }}
                >
                    <Icon name="Play" height="20" width="20" />
                </button>
                <div
                    className={
                        styleName === "simplify" ? "itemIcon" : "itemIcon trackTopAlign"
                    }
                    style={{ marginTop: styleName === "simplify" ? 0 : "none" }}
                >
                    <Icon name="Music" />
                </div>
            </div>

            {styleName === "simplify" && (
                <div className="trackMidAlign">
                    <div className="trackItemThumb">
                        {thumbNail ? (
                            <img
                                loading="lazy"
                                src={thumbNail}
                                style={{ width: "100%", height: "100%" }}
                                alt=""
                            />
                        ) : (
                            <div
                                style={{
                                    position: "absolute",
                                    top: "35%",
                                    bottom: "35%",
                                    left: "35%",
                                    right: "35%",
                                }}
                            >
                                <Icon name="Music2" />
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="trackItemInfo">
                <div
                    className={
                        styleName === "simplify" ? "trackMidAlign" : "trackTopAlign"
                    }
                >
                    <div className="trackName ellipsis-one-line">{name}</div>

                    {styleName !== "simplify" && (
                        <div className="trackInfo">
                            <span
                                className="explicit-label"
                                style={explicit ? { display: "flex" } : { display: "none" }}
                            >
                                E
                            </span>
                            <span className="trackArtists ellipsis-one-line">
                                {artists && artists.map((artist:any) => (
                                    <a href={`/artist/${artist.id}`} key={artist.id}>
                                        {artist.name}
                                    </a>
                                ))}
                            </span>
                            {album && (
                                <>
                                    <span className="trackInfoSep">•</span>
                                    <span className="trackAlbum ellipsis-one-line">
                                        <a href={`/ablum/${album.id}`}>{album.name}</a>
                                    </span>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="trackItemDuration">
                <div
                    className={`duration ${
                        styleName === "simplify" ? "trackMidAlign" : "trackTopAlign"
                    }`}
                >
                    <span>{formattedTime}</span>
                </div>
            </div>
        </li>
    );
})