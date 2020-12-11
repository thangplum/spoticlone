import React, { useState } from 'react'
import { PageTitle } from '../components/MainPageComponent/PageTitle';
import { PlayCard } from '../components/MainPageComponent/PlayCard';
import useId from '../utilities/hooks/useID';

interface GenreProps {

}

export const Genre: React.FC<GenreProps> = ({}) => {
    const id = useId();
    const [name, setName] = useState("");


    return (
        // <div className='GenrePage page-content'>
        //     <PageTitle title={name}/>
        //     <div className="browseGrid">
        //         {playLists.map(playlist => (
        //             <PlayCard ref={lastRef} key={playlist.id} info={playlist} type="playlist"/>
        //         ))}
        //     </div>
        // </div>
        <></>
    );
}