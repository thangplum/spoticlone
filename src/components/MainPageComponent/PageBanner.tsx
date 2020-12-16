import React, { CSSProperties } from "react";
import Icon from "../../icons";
import randomColor from 'randomcolor';

interface PageBannerProps {
  title: string;
  bannerInfo: any;
  totalTracks: number;
}

function followerTitle(title: string) {
  switch (title) {
    case "profile":
      return "Followers";
    case "artist":
      return "monthly listeners";
    default:
      return "Likes";
  }
}

const followerStyle = {
  fontSize: "16px",
  lineHeight: "2",
  marginTop: "4px",
  color: "#fff",
} as CSSProperties;

const spanStyle = {
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  marginTop: "4px",
  wordBreak: "break-word",
  overflow: "hidden",
} as CSSProperties;

export const PageBanner: React.FC<PageBannerProps> = ({
  title,
  bannerInfo,
  totalTracks,
}) => {
  const {
    name,
    description,
    user,
    followers,
    primary_color,
    images,
    release_date,
    total,
    publisher,
  } = bannerInfo;
  let imgUrl, likes;
  if (images && images.length > 0) {
    imgUrl = images[0].url;
  }

  let secondary_color = randomColor({
    luminosity: 'dark',
    hue: 'random'
  })

  if (followers) {
    likes = followers.toLocaleString("en-US");
  }
  return (
    <div
      className="banner"
      style={{
        background: `linear-gradient(to bottom, ${primary_color} 0%, ${secondary_color} 100%)`,
        height: title === "artist" ? "40vh" : "30vh",
      }}
    >
      <div
        className={`bannerImgDiv ${
          title === "profile" || title === "artist" ? "circleDiv" : null
        }`}
      >
        {imgUrl ? (
          <img
            loading="lazy"
            src={imgUrl}
            className={`bannerImg ${
              title === "profile" || title === "artist" ? "circleDiv" : null
            }`}
            alt=""
          />
        ) : (
          <div className="svgSizing">
            <Icon name="Music2" />
          </div>
        )}
      </div>

      <div className="bannerInfo">
        <h2 className="pageTitleSmall">{title}</h2>
        <span style={spanStyle}>
          <h1 className={name.length > 15 ? "bannerTitleXL" : "bannerTitle"}>
            {name}
          </h1>
        </span>
        {description && description !== "" && (
          <p
            className="bannerDescription"
            style={{
              display: description === "" ? "none" : "flex",
              fontSize: "12px",
              color: "hsla(0,0%,100%,.7)",
            }}
          >
            {description}
          </p>
        )}
        {publisher && publisher !== "" && (
          <p
            className="bannerDescription"
            style={{
              display: publisher === "" ? "none" : "flex",
              fontWeight: 600,
              fontSize: "18px",
              color: "hsla(0,0%,100%,.7)",
            }}
          >
            {publisher}
          </p>
        )}

        <div className="additionalInfo">
          {user &&
            user[0] &&
            user.map((person: any, index: number) => (
              <>
                {person.images && person.images[0] ? (
                  <img
                    style={{
                      borderRadius: "50%",
                      width: "25px",
                      marginRight: "10px",
                    }}
                    src={person.images[0].url}
                    alt=""
                  ></img>
                ) : (
                  <></>
                )}
                <a
                  key={index}
                  href={`/${person.type}/${person.id}`}
                  style={{ content: "none", textTransform: "none" }}
                >
                  {person.type && person.type === "artist"
                    ? person.name
                    : person.display_name}
                </a>
                {totalTracks !== 0 && <p>{totalTracks} songs</p>}
              </>
            ))}
          {total !== 0 && total && <p>{total} Playlists</p>}
          {release_date && <p>{release_date}</p>}
          {followers !== 0 && (
            <p style={title === "artist" ? followerStyle : undefined}>
              {likes} {followerTitle(title)}
            </p>
          )}
        </div>
      </div>
      <div className="bannerOverlay"></div>
    </div>
  );
};
