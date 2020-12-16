// eslint-disable-next-line
import React, { useState, useRef, useCallback } from 'react';
import createRequest from '../createRequest';

function useInfiScroll(setList: React.Dispatch<React.SetStateAction<any[]>>): [
  React.Dispatch<React.SetStateAction<string>>,
  (node: HTMLLIElement | HTMLDivElement | null) => void 
] {
    const [next, setNext] = useState("");

    const observer = useRef<any>();

    const lastRef = useCallback(node => {
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if(entries[0].isIntersecting && next){
                const [, makeRequest] = createRequest(next)
                makeRequest()
                    .then(data => {
                        let resultList: SpotifyApi.SavedTrackObject[], 
                            next: string
                        if (data.items && data.items[0].track){
                          resultList = data.items
                        }else{
                          resultList = data.items || data.playlists.items
                        }

                        if (data.playlists){
                            next = data.playlists.next
                        }else{
                            next = data.next
                        }

                        setList(tracks => [...tracks, ...resultList])
                        setNext(next)
                    })
                    .catch(error => console.log(error))
            }
        }, {threshold: 0.75})
        if (node) observer.current.observe(node)
    // eslint-disable-next-line
    }, [next])

    return [setNext, lastRef];
}

export default useInfiScroll;