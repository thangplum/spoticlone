import React from "react";
import Icon from "../../../icons";

interface ControlButtonProps {
  title: string;
  icon: string;
  size?: string;
  active?: any;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  extraClass?: string;
}

export const ControlButton: React.FC<ControlButtonProps> = (props) => {
  return (
    <button
      title={props.title}
      className={`control-button ${props.size && props.size} ${
        props.active ? "active" : ""
      } ${props.extraClass && props.extraClass} no-outline`}
      onClick={props.onClick}
    >
      <Icon name={props.icon} />
    </button>
  );
};
