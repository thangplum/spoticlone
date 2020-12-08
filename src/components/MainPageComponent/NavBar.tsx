import React, { useEffect, useState } from 'react';
import {useLocation} from 'react-router-dom';

interface NavBarProps {
    children: any
}


export const NavBar: React.FC<NavBarProps> = ({children}) => {
    return (
        <div className="header-bar" >
            {children}
        </div>
    );
}