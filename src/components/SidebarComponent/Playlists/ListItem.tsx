import React from 'react'
import { NavLink } from 'react-router-dom';

interface ListItemProps {
    name: string,
    id: string
}

export const ListItem: React.FC<ListItemProps> = ({name, id}) => {
    return (
        <li className='side-list'>
            <NavLink to={`/playlist/${id}`} className='list-link' activeStyle={{color: '#fff'}}>
                <div className="list-wrapper">
                    {name}
                </div>
            </NavLink>
        </li>
    );
}