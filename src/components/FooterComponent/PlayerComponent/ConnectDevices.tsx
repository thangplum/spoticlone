import React, { useEffect, useRef, useState } from "react";
import { ConnectDevicesItem } from "./ConnectDevicesItem";
import SpotifyWebApi from "spotify-web-api-js";
interface ConnectDevicesProps {
  token: string;
  closeTip: () => void;
}

function useOutsideClick(
  ref: React.RefObject<HTMLDivElement>,
  closeTip: () => void
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        closeTip();
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);
}

export const ConnectDevices: React.FC<ConnectDevicesProps> = ({
  token,
  closeTip,
}) => {
  const [devices, setDevices] = useState<SpotifyApi.UserDevice[]>([]);
  const spotifyApi = new SpotifyWebApi();

  useEffect(() => {
    if (token) {
      spotifyApi.setAccessToken(token);

      spotifyApi.getMyDevices().then(
        function (data) {
          data.devices.map((device, index) =>
            setDevices((devices) => [...devices, device])
          );
        },
        function (err) {
          console.log(err);
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const switchDevice = (e: React.MouseEvent) => {
    if (!(e.currentTarget instanceof HTMLButtonElement)) {
      return;
    }
    const id = e.currentTarget.dataset.id;
    const device_ids: string[] = [id as string];
    spotifyApi.setAccessToken(token);
    spotifyApi.transferMyPlayback(device_ids);
  };

  const wrapperRef = useRef<HTMLDivElement>(null);
  useOutsideClick(wrapperRef, closeTip);

  return (
    <div className="connect-devices" data-source="inside" ref={wrapperRef}>
      <div className="connect-devices-content" data-source="inside">
        <div className="connect-devices-title" data-source="inside">
          <h1 data-source="inside">Connect to a device</h1>
        </div>
        <div className="cd-img" data-source="inside">
          <img
            loading="lazy"
            data-source="inside"
            src="https://open.scdn.co/cdn/images/connect_header@1x.ecc6912d.png"
            alt=""
            draggable="false"
          />
        </div>

        {devices.length === 0 ? (
          <ConnectDevicesItem name="No devices available" disable />
        ) : (
          <ul className="connect-devices-list">
            {devices.map((device, index) => (
              <ConnectDevicesItem
                name={device.name}
                key={index}
                active={device.is_active}
                id={device.id}
                onClick={switchDevice}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
