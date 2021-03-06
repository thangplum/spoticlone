import { CancelTokenSource } from "axios";
import React, { useState, useRef, useCallback } from "react";
import requestWithToken from "../requestWithToken";

export function useLoadScroll(
  setTrack: React.Dispatch<React.SetStateAction<any[]>>,
  token: string,
  cancelSource: CancelTokenSource
): [
  React.Dispatch<React.SetStateAction<string>>,
  (node: HTMLLIElement) => void
] {
  const [next, setNext] = useState("");

  const observer = useRef<any>();

  const lastRef = useCallback(
    (node) => {
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && next) {
          const req = requestWithToken(next, token, cancelSource);
          req()
            .then((response) => {
              const data = response.data;
              let next = null;
              if (data.next) {
                next = data.next;
              } else if (data.playlists) {
                next = data.playlists.next;
              }
              const newTracks = data.items;
              setTrack((tracks) => [...tracks, ...newTracks]);
              setNext(next);
            })
            .catch((error) => console.log(error));
        }
      });
      if (node) observer.current.observe(node);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [next]
  );

  return [setNext, lastRef];
}
