import React from "react";

interface NavBarProps {
  children: any;
}

export const NavBar: React.FC<NavBarProps> = ({ children }) => {
  return <div className="header-bar">{children}</div>;
};
