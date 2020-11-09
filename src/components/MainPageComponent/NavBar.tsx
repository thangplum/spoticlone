import React, { useEffect, useState } from 'react';
import {useLocation} from 'react-router-dom';

interface NavBarProps {
    children: any
}


export const NavBar: React.FC<NavBarProps> = ({children}) => {
    const location = useLocation()
    
    return (
        <div className="header-bar" style={{background: location.pathname === '/'? '':'none'}}>
            {children}
        </div>
    );
}