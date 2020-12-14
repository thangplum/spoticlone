import React, { useEffect, useState } from 'react'
import { BrowseCard } from '../components/MainPageComponent/BrowseCard';
import { PageTitle } from '../components/MainPageComponent/PageTitle';
import SpotifyWebApi from 'spotify-web-api-js';
import createRequest from '../utilities/createRequest';

interface BrowseProps {

}

export const Browse: React.FC<BrowseProps> = ({}) => {
    const [genre, setGenre] = useState<SpotifyApi.CategoryObject[]>([]);

    useEffect(() => {
        const [source, makeRequest] = createRequest('https://api.spotify.com/v1/browse/categories?limit=50')

        makeRequest()
            .then((data) => {
                setGenre(data.categories.items)
            })
            .catch((error) => console.log(error))
        
        return () => source.cancel()
    }, [])

    return (
        <div className="page-content">
            <div className='browsePage'>
                <PageTitle title='Browse All' />
                <div className="browseGrid">
                    {genre.map((genre) => {
                        return <BrowseCard key={genre.id} info={genre}/>
                    })} 
                </div>
            </div>
        </div>
    );
}