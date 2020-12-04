import React from 'react';
import Loader from 'react-loader-spinner';

interface LoadingProps {
    type: string
}

export const Loading: React.FC<LoadingProps> = ({type}) => {
        return (
            <div className='loading'>
            {type === 'app'
                ? <Loader 
                    type='Bars'
                    color='#1db954'/>
                : <Loader 
                    type='ThreeDots'
                    color='#fff'/>}
            </div>
        );
}