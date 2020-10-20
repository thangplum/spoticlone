import React from 'react'
import { NavLink } from 'react-router-dom';
import Icon from '../../../icons';

interface FeaturedItemProps {
    label: string;
}

export const FeaturedItem: React.FC<FeaturedItemProps> = ({label}) => {
        return (
            <div className='featured-item' style={{cursor: 'pointer'}} >
                <NavLink exact to="/tracks" className='featured-item-link' style={{ pointerEvents: 'auto'}} activeStyle={{opacity:'1'}}>
                    <div className="playlist-icon">
                        <Icon name='Like' />
                    </div>
                    <span className="featured-label">{label}</span>
                </NavLink>
            </div>
        );
}