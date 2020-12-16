import React from "react";

interface CardInfoProps {
  title: string;
  description: string;
}

const titleStyle = {
  fontSize: "16px",
  fontWeight: 700,
  lineHeight: "24px",
  letterSpacing: "normal",
  textTransform: "none",
  textOverflow: "ellipsis",
  overflow: "hidden",
  color: "white",
  whiteSpace: "nowrap",
} as React.CSSProperties;

const descriptionStyle = {
  fontSize: "13px",
  fontWeight: 500,
  lineHeight: "16px",
  letterSpacing: "normal",
  textTransform: "none",
  textOverflow: "ellipsis",
  overflow: "hidden",
  marginTop: "4px",
  whiteSpace: "normal",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
} as React.CSSProperties;

export const CardInfo: React.FC<CardInfoProps> = ({ title, description }) => {
  return (
    <div className="CardInfo">
      <h2 style={titleStyle}>{title}</h2>
      <p style={descriptionStyle}>{description}</p>
    </div>
  );
};
