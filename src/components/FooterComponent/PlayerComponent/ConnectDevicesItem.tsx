import React from "react";

interface ConnectDevicesItemProps {
  name: string;
  disable?: boolean;
  active?: boolean;
  id?: string | null;
  onClick?(e: React.MouseEvent): void;
}

export const ConnectDevicesItem: React.FC<ConnectDevicesItemProps> = ({
  name,
  disable,
  active,
  id,
  onClick,
}) => {
  return (
    <button
      className={`connect-devices-items ${disable ? "disable" : ""} ${
        active ? "active" : ""
      } ellipsis-one-line no-outline`}
      data-id={id}
      onClick={onClick}
    >
      <div className="cd-info">
        <h1>{name}</h1>
      </div>
    </button>
  );
};
