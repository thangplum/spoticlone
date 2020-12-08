import React from 'react'
import { Browse } from './Browse';
import { SearchResult } from './SearchResult';

interface SearchProps {
    query: string
}

export const Search: React.FC<SearchProps> = ({ query }) => {

    return (
        <>
            {query === ""
                ? <Browse />
                : <SearchResult query={query} />
            }
        </>
    );
}