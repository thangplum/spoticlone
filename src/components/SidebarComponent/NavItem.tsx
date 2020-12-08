import React, { CSSProperties, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Icon from '../../icons';

interface NavItemProps {
    to: string;
    exact: boolean;
    label: string;
    iconName: string;
    getSelected: Function;
    currentState: string;
    dataTip?: string;
    dataFor?: string;
    dataEvent?: string;
    style?: CSSProperties;
}

export const NavItem: React.FC<NavItemProps> = ({to, exact, label, iconName, getSelected, currentState, dataTip, dataEvent, dataFor, style}) => {
    const changeState = () => {
        getSelected(label);
    } 

    return (
        <li onClick={changeState} className={`NavItem ${currentState == label ? 'selected' : ''}`} data-tip={dataTip} data-for={dataFor} data-event={dataEvent}>
            {exact 
                ?   <NavLink exact to={to} className="nav-link" style={style}>
                        <div className="nav-icon">
                            <Icon name={iconName} />
                        </div>
                        <span>{label}</span>
                    </NavLink>
                :   <NavLink to={to} className="nav-link" style={style}>
                        <div className="nav-icon">
                            <Icon name={iconName} />
                        </div>
                        <span>{label}</span>
                    </NavLink>
            }
            
            
        </li>
    );
}