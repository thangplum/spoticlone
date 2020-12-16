import React from "react";

interface PageTitleProps {
  title: string;
}

const style = {
  fontSize: "60px",
  fontWeight: 700,
  lineHeight: "28px",
  letterSpacing: "-.04em",
  textTransform: "none",
  color: "#fff",
} as React.CSSProperties;

export const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
  return (
    <div className="smallBanner">
      <div className="pageTitleContainer">
        <h1 style={style}>{title}</h1>
      </div>
      <div className="bannerOverlay"></div>
    </div>
  );
};
