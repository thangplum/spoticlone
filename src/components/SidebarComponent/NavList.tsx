import React from 'react'

interface NavListProps {

}

export const NavList: React.FC<NavListProps> = ({children}) => {
    return (
        <ul className="nav-list">
            {children}
        </ul>
    );
}

export default NavList;