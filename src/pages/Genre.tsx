import React, { useContext, useEffect, useState } from "react";
import { Loading } from "../components/MainPageComponent/Loading";
import { PageTitle } from "../components/MainPageComponent/PageTitle";
import { PlayCard } from "../components/MainPageComponent/PlayCard";
import { MessageContext } from "../utilities/context";
import createRequest from "../utilities/createRequest";
import useId from "../utilities/hooks/useID";
import useInfiScroll from "../utilities/hooks/useInfiScroll";

interface GenreProps {}

export const Genre: React.FC<GenreProps> = () => {
  const id = useId();
  const [name, setName] = useState("");
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const setMessage = useContext(MessageContext);
  const [setNext, lastRef] = useInfiScroll(setPlaylists);

  useEffect(() => {
    const [nameSource, requestName] = createRequest(
      `https://api.spotify.com/v1/browse/categories/${id}`
    );
    const [listSource, requestList] = createRequest(
      `https://api.spotify.com/v1/browse/categories/${id}/playlists?limit=50`
    );

    const makeRequest = async () => {
      try {
        const [nameData, listData] = await Promise.all([
          requestName(),
          requestList(),
        ]);
        setName(nameData.name);
        setPlaylists(listData.playlists.items);
        setNext(listData.playlists.next);
      } catch (error) {
        setMessage(error);
      }
    };

    if (id) {
      makeRequest();
      setLoading(false);
    }

    return () => {
      nameSource.cancel();
      listSource.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return loading ? (
    <Loading type="genre" />
  ) : (
    <div className="GenrePage page-content">
      <PageTitle title={name} />
      <div className="browseGrid">
        {playlists.map((playlist) => (
          <PlayCard
            ref={lastRef}
            key={playlist.id}
            info={playlist}
            type="playlist"
          />
        ))}
      </div>
    </div>
  );
};
