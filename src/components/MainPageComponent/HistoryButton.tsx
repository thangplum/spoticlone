import React from "react";
import Icon from "../../icons";

interface HistoryButtonProps {
  property: string;
  onClick: () => void;
}

export const HistoryButton: React.FC<HistoryButtonProps> = ({
  property,
  onClick,
}) => {
  return (
    <button className="navButton" onClick={onClick}>
      <Icon name={property} />
    </button>
  );
};
