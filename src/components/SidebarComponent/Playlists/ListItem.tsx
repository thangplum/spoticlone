import React from "react";
import { NavLink } from "react-router-dom";

interface ListItemProps {
  name: string;
  id: string;
  ref?: (node: HTMLLIElement | null) => void;
}

export const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(
  ({ name, id }, ref) => {
    return (
      <li ref={ref} className="side-list">
        <NavLink
          to={`/playlist/${id}`}
          className="list-link"
          activeStyle={{ color: "#fff" }}
        >
          <div className="list-wrapper">{name}</div>
        </NavLink>
      </li>
    );
  }
);
