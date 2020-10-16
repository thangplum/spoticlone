import React from 'react';
import ReactTooltip from "react-tooltip";
import Logo from "../icons/Logo";
import NavList from './SidebarComponent/NavList';
import { NavItem } from './SidebarComponent/NavItem';
import { PlayList } from './SidebarComponent/PlayList';

interface SideBarProps {

}

export const SideBar: React.FC<SideBarProps> = ({}) => {
    return (
        <>
            <div className="sidebar">
                <Logo />
                <NavList>
                    <NavItem to="/" iconName='Home' label='Home'></NavItem>
                    <NavItem to="/search" iconName='Search' label='Search'></NavItem>
                    <NavItem to="/collection" iconName='Library' label='Library'></NavItem>
                </NavList>
                <PlayList />
            </div>
        </>
    );
}

export default SideBar;