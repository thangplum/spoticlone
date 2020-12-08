import React from 'react'
import { SearchRow } from '../components/MainPageComponent/SearchRow';

interface SearchResultProps {
    query: string
}

export const SearchResult: React.FC<SearchResultProps> = ({ query }) => {
    return (
        <div className="page-content">
            <div className='pageContent'>
                <SearchRow title='Songs' type='track' query={query}/>
                <SearchRow title='Artists' type='artist' query={query}/>
                <SearchRow title='Albums' type='album' query={query}/>
                <SearchRow title='Playlists' type='playlist' query={query}/>
            </div>
        </div>
    );
}