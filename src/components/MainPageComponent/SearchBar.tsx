import React, { useEffect } from "react";
import Icon from "../../icons";

interface SearchBarProps {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  resetQuery: Function;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  setQuery,
  resetQuery,
}) => {
  useEffect(() => {
    resetQuery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="SearchContainer">
      <div className="SearchBar">
        <div
          style={{
            position: "absolute",
            top: "0",
            bottom: "0",
            left: "12px",
            display: "flex",
            alignItems: "center",
            cursor: "text",
          }}
        >
          <Icon name="N-Search" />
        </div>
        <input
          className="SearchInput no-outline"
          maxLength={80}
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          autoFocus={true}
          placeholder="Search for Artists, Songs, or Podcasts"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
    </div>
  );
};
