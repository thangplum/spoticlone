import React from 'react'
import { Route, Switch } from 'react-router-dom';
import { Home } from '../../pages/Home';

interface PageContentProps {
    query: string,
    message: string,
    status: boolean
}

export const PageContent: React.FC<PageContentProps> = ({query, message, status}) => {
    return (
        <>
            <Switch>
                <Route exact path="/">
                    <Home />
                </Route>
            </Switch>
            <div className={`status-bar-wrapper ${status? 'active':''}`}>
                <div className={`status-bar ${status? 'active':''}`}>{message}</div>
            </div>
        </>
    );
}