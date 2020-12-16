import React, { CSSProperties } from "react";
import Icon from "../../icons";

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

  if (followers) {
    likes = followers.toLocaleString("en-US");
  }
  return (
    <div
      className="banner"
      style={{
        backgroundColor: `${primary_color}`,
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
        <h2 className="pageTitle">{title}</h2>
        <span style={spanStyle}>
          <h1 className={name.length > 15 ? "bannerTitleXL" : "bannerTitle"}>
            {name}
          </h1>
        </span>
        {publisher && publisher !== "" && (
          <p
            className="bannerDescription"
            style={{
              display: publisher === "" ? "none" : "flex",
              fontWeight: 600,
              fontSize: "18px",
              color: "white",
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
          {total !== 0 && total && <h2>{total} Playlists</h2>}
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
