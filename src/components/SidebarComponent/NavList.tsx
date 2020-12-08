import React, { useContext } from 'react';

interface NavListProps {

}

const NavList: React.FC<NavListProps> = ({children}) => {
    return (
        <ul className="nav-list">
            {children}
        </ul>
    );
}

export default NavList;