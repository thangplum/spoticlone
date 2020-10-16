import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Icon from '../../icons';

interface NavItemProps {
    to: string;
    label: string;
    iconName: string;
}

export const NavItem: React.FC<NavItemProps> = ({to, label, iconName}) => {
    return (
        <li className="NavItem">
            <NavLink exact to={to} className="nav-link">
                <div className="nav-icon">
                    <Icon name={iconName} />
                </div>
                <span>{label}</span>
            </NavLink>
            
        </li>
    );
}