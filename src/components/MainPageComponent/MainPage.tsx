import React, { useContext, useState } from 'react'
import { HistoryToggle } from './HistoryToggle';
import { NavBar } from './NavBar';
import { Route } from 'react-router-dom'
import { SearchBar } from './SearchBar';
import { CollectionHeader } from './CollectionHeader';
import { LinkContext, LoginContext } from '../../utilities/context';
import UserInfo from './UserInfo';
import { UserPrompt } from './UserPrompt';
import { PageContent } from './PageContent';

interface MainPageProps {
    message: string,
    status: boolean
}

export const MainPage: React.FC<MainPageProps> = ({message, status}) => {
    const [query, setQuery] = useState("")
    const login = useContext(LoginContext);
    
    const resetQuery = () => {
        setQuery("")
    }
    
    return (
        <div className="featured">
            <NavBar>
                <HistoryToggle />
                <Route exact path='/search'>
                    <SearchBar query={query} setQuery={setQuery} resetQuery={resetQuery} />
                </Route>
                <Route path='/collection'>
                    <CollectionHeader />
                </Route>
                {login ? <UserInfo /> : <UserPrompt />}
            </NavBar>
            <PageContent query={query} message={message} status={status} />
        </div>
        
    );
}