import React, { useState } from 'react';
import Logo from "../icons/Logo";
import NavList from './SidebarComponent/NavList';
import { NavItem } from './SidebarComponent/NavItem';
import { PlayList } from './SidebarComponent/PlayList';
import SpotifyWebApi from 'spotify-web-api-js';

interface SideBarProps {
    playlists: SpotifyApi.PlaylistObjectSimplified[]
}

const SideBar: React.FC<SideBarProps> = ({playlists}) => {
    const [selected, getSelected] = useState("Home");

    return (
        <>
            <div className="sidebar">
                <Logo />
                <NavList>
                    <NavItem to="/" iconName='Home' label='Home' getSelected={getSelected} currentState={selected}></NavItem>
                    <NavItem to="/search" iconName='Search' label='Search' getSelected={getSelected} currentState={selected}></NavItem>
                    <NavItem to="/collection" iconName='Library' label='Library' getSelected={getSelected} currentState={selected}></NavItem>
                </NavList>
                <PlayList playlists={playlists} />
            </div>
        </>
    );
}

export default SideBar;