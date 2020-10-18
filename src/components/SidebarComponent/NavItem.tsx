import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Icon from '../../icons';

interface NavItemProps {
    to: string;
    label: string;
    iconName: string;
    getSelected: Function;
    currentState: string;
}

export const NavItem: React.FC<NavItemProps> = ({to, label, iconName, getSelected, currentState}) => {
    const changeState = () => {
        getSelected(label);
    } 

    return (
        <li onClick={changeState} className={`NavItem ${currentState == label ? 'selected' : ''}`}>
            <NavLink exact to={to} className="nav-link">
                <div className="nav-icon">
                    <Icon name={iconName} />
                </div>
                <span>{label}</span>
            </NavLink>
            
        </li>
    );
}