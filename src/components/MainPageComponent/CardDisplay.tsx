import React from 'react'

interface CardDisplayProps {
    url: string,
    type: string
}

export const CardDisplay: React.FC<CardDisplayProps> = ({url, type}) => {
    return (
        <div className="CardDisplay" style={{borderRadius: type ==='artist'?'50%':'0'}}>
            <img src={url} loading='lazy' className='previewImg' style={{borderRadius: type ==='artist'?'50%':'0'}} alt=''></img>
        </div>
    );
}