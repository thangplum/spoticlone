import React, { useEffect, useState } from 'react'
import createRequest from '../../utilities/createRequest';
import { SearchRowGrid } from './SearchRowGrid';
import { SearchRowTitle } from './SearchRowTitle';

interface SearchRowProps {
    title: string,
    type: string,
    query: string
}

export const SearchRow: React.FC<SearchRowProps> = ({title, type, query}) => {
    const [result, setResult] = useState([]);
    const [formattedQuery, setFormattedQuery] = useState("");

    useEffect(() => {
        const temp = query.toLowerCase().replace(" ", "+");
        console.log(temp);
        setFormattedQuery(temp);
    }, [query])

    useEffect(() => {
        const {source, makeRequest} = createRequest(`https://api.spotify.com/v1/search?q=${formattedQuery}&type=${type}&limit=9`)
        if (formattedQuery.length > 0){
            makeRequest()
                .then((data) => {
                    console.log(data);
                    const key = Object.keys(data)[0]
                    const result = data[key].items
                    setResult(result)
                })
                .catch((error) => {
                    console.log(error)
                })
        }
        return () => source.cancel()
    }, [formattedQuery, type])

    return (
        <div className='CollectionRow' style={{display: result.length===0? 'none':'grid'}}>
            <SearchRowTitle title={title}/>
            <SearchRowGrid type={type} info={result}/>
        </div>
    );
}