import React, { useContext, useEffect, useState } from 'react';
import Logo from "../../icons/Logo";
import NavList from './NavList';
import { NavItem } from './NavItem';
import { PlayList } from './PlayList';
import { Install } from './Install';
import { LoginContext } from '../../utilities/context';


interface SideBarProps {
    playlists: SpotifyApi.PlaylistObjectSimplified[]
}

const SideBar: React.FC<SideBarProps> = ({playlists}) => {
    const [selected, getSelected] = useState(localStorage.getItem("SelectedSidebarItem") || "Home");
    const loggedIn = useContext(LoginContext);

    useEffect(() => {
        localStorage.setItem("SelectedSidebarItem", selected);
    }, [selected])
    return (
        <>
            <div className="sidebar">
                <Logo />
                <NavList>
                    <NavItem to="/" iconName='Home' label='Home' getSelected={getSelected} currentState={selected}></NavItem>
                    <NavItem to="/search" iconName='Search' label='Search' getSelected={getSelected} currentState={selected}></NavItem>
                    <NavItem to="/collection" iconName='Library' label=' Your Library' getSelected={getSelected} currentState={selected}></NavItem>
                </NavList>
                
                <PlayList playlists={playlists} />
                {loggedIn ? <Install /> : null}
                
            </div>
        </>
    );
}

export default SideBar;