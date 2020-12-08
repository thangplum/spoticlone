import React, { useContext, useEffect, useState } from 'react';
import Logo from "../../icons/Logo";
import NavList from './NavList';
import { NavItem } from './NavItem';
import { PlayList } from './PlayList';
import { Install } from './Install';
import { LoginContext } from '../../utilities/context';
import { generateContent } from '../../utilities/tipContent';
import ReactToolTip from 'react-tooltip';

interface SideBarProps {
    playlists: SpotifyApi.PlaylistObjectSimplified[]
}

const SideBar: React.FC<SideBarProps> = ({playlists}) => {
    const loggedIn = useContext(LoginContext);
    return (
        <>
            <div className="sidebar">
                <Logo />
                <NavList>
                    <NavItem to="/" exact={true} iconName='Home' label='Home' />
                    <NavItem to="/search" exact={true} iconName='Search' label='Search'  />
                    <NavItem to="/collection" exact={false} iconName='Library' label='Your Library' dataTip='library' dataFor='tooltip' dataEvent='click' style={{ pointerEvents: loggedIn? 'auto':'none'}} />
                </NavList>
                
                <PlayList playlists={playlists} />
                {loggedIn ? <Install /> : null}
            </div>
            <ReactToolTip className='toolTip' id='tooltip' disable={loggedIn} place='right' effect='solid' globalEventOff='click' backgroundColor= '#2e77d0' getContent={dataTip => generateContent(dataTip)} clickable={true}/>
        </>
        
    );
}

export default SideBar;