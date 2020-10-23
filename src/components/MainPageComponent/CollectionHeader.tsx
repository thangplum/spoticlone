import React from 'react'
import { NavLink } from 'react-router-dom';

interface CollectionHeaderProps {

}

const activeStyle = {
    backgroundColor: '#333'
}

export const CollectionHeader: React.FC<CollectionHeaderProps> = ({}) => {
    return (
        <div className='cNavWrapper'>
            <nav className='cNav'>
                <ul className='cNavList'>
                    <li>
                        <NavLink to='/collection/playlists' activeStyle={activeStyle}>Playlists</NavLink>
                    </li>
                    <li>
                        <NavLink to='/collection/podcasts' activeStyle={activeStyle}>Podcasts</NavLink>
                    </li>
                    <li>
                        <NavLink to='/collection/artists' activeStyle={activeStyle}>Artists</NavLink>
                    </li>
                    <li>
                        <NavLink to='/collection/albums' activeStyle={activeStyle}>Albums</NavLink>
                    </li>
                </ul>
            </nav>
        </div>
    );
}