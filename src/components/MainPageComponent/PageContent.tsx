import React, { useContext } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom';
import { Search } from '../../pages/Search';
import { Home } from '../../pages/Home';
import { Collection } from '../../pages/Collection';
import { generateContent } from '../../utilities/tipContent';
import ReactToolTip from 'react-tooltip';
import { LoginContext } from '../../utilities/context';
import { Like } from '../../pages/Like';
import { Playlist } from '../../pages/Playlist';
import { Album } from '../../pages/Album';


interface PageContentProps {
  query: string;
  message: string;
  status: boolean;
}

export const PageContent: React.FC<PageContentProps> = ({query, message, status}) => {
    const loggedIn = useContext(LoginContext);
    return (
        <>
            <Switch>
                <Route exact path="/">
                  <Home />
                </Route>
                <Route path='/search'>
                  <Search query={query} />
                </Route>
                <Route path='/collection'>
                  {loggedIn ? <Redirect to='/collection/playlists'/> : <Redirect to='/'/>}
                  <Collection />
                </Route>
                <Route path='/tracks'>
                  {loggedIn ? <Like />:<Redirect to='/'/>}
                </Route>
                <Route path='/playlist'>
                  <Playlist />
                </Route>
                <Route path='/album' >
                  <Album />
                </Route>
            </Switch>
            <div className={`status-bar-wrapper ${status? 'active':''}`}>
                <div className={`status-bar ${status? 'active':''}`}>{message}</div>
            </div>
            <ReactToolTip className='toolTip ttMain' id='tooltipMain' disable={loggedIn} place='bottom' effect='solid'  backgroundColor= '#2e77d0' globalEventOff='click' getContent={dataTip => generateContent(dataTip)} clickable={true}/>
        </>
    );
}