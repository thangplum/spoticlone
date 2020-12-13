import { CancelTokenSource } from 'axios';
import React, { useState, useRef, useCallback } from 'react';
import requestWithToken from '../requestWithToken';

export function useLoadScroll(setTrack: React.Dispatch<React.SetStateAction<SpotifyApi.SavedTrackObject[]>>, token: string, cancelSource: CancelTokenSource): [
    React.Dispatch<React.SetStateAction<string>>,
    (node: HTMLLIElement) => void
  ]  {
    const [next, setNext] = useState("");

    const options = {
        root: null, // window by default
        rootMargin: '0px',
        threshold: 0.25
    };

    const observer = useRef<any>();

    const lastRef = useCallback(node => {
        if (observer.current) {
            observer.current.disconnect();
        }
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && next) {
                const req = requestWithToken(next, token, cancelSource);
                req()
                    .then((response) => {
                        const data = response.data;
                        const next = data.next || data.playlists.next;
                        setTrack(tracks => [...tracks, ...data.items])
                        setNext(next)
                    })
                    .catch((error) => console.log(error))
            }
        }, options)
        
        if (node) observer.current.observe(node)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [next])

    return [setNext, lastRef];
}