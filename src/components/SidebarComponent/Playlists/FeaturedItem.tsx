import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import Icon from "../../../icons";
import { LoginContext } from "../../../utilities/context";

interface FeaturedItemProps {
  label: string;
}

export const FeaturedItem: React.FC<FeaturedItemProps> = ({ label }) => {
  const loggedIn = useContext(LoginContext);
  return (
    <div
      className="featured-item"
      style={{ cursor: "pointer" }}
      data-tip="list"
      data-for="tooltip"
      data-event="click"
    >
      <NavLink
        exact
        to="/tracks"
        className="featured-item-link"
        style={{ pointerEvents: loggedIn ? "auto" : "none" }}
        activeStyle={{ opacity: "1" }}
      >
        <div className="playlist-icon">
          <Icon name="Like" />
        </div>
        <span className="featured-label">{label}</span>
      </NavLink>
    </div>
  );
};
