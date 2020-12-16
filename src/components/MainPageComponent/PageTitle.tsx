import React from "react";
import randomColor from 'randomcolor';

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
  let primary_color = randomColor({
    luminosity: 'light',
    hue: 'random'
  })

  let secondary_color = randomColor({
    luminosity: 'dark',
    hue: 'random'
  })
  return (
    <div className="smallBanner" style={{background: `linear-gradient(to bottom, ${primary_color} 0%, ${secondary_color} 100%)`}}>
      <div className="pageTitleContainer">
        <h1 style={style}>{title}</h1>
      </div>
      <div className="bannerOverlay"></div>
    </div>
  );
};
