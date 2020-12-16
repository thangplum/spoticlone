import React, { useEffect, useState } from "react";
import createRequest from "../../utilities/createRequest";
import getLocale from "../../utilities/locale";
import { SearchRowGrid } from "./SearchRowGrid";
import { SearchRowTitle } from "./SearchRowTitle";

interface SearchRowProps {
  title: string;
  type: string;
  query: string;
}

export const SearchRow: React.FC<SearchRowProps> = ({ title, type, query }) => {
  const [result, setResult] = useState([]);
  const [formattedQuery, setFormattedQuery] = useState("");
  const [, market] = getLocale();

  useEffect(() => {
    const temp = query.toLowerCase().replace(" ", "+");
    setFormattedQuery(temp);
  }, [query]);

  useEffect(() => {
    const [source, makeRequest] = createRequest(
      `https://api.spotify.com/v1/search?q=${formattedQuery}&type=${type}&limit=9&market=${market.toLowerCase()}`
    );
    if (formattedQuery.length > 0) {
      makeRequest()
        .then((data) => {
          const key = Object.keys(data)[0];
          const result = data[key].items;
          setResult(result);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    return () => source.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formattedQuery, type]);

  return (
    <div
      className="CollectionRow"
      style={{ display: result.length === 0 ? "none" : "grid" }}
    >
      <SearchRowTitle title={title} />
      <SearchRowGrid type={type} info={result} />
    </div>
  );
};
