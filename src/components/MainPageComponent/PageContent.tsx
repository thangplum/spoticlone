import React from 'react'
import { Route, Switch } from 'react-router-dom';
import { Home } from '../../pages/Home';

interface PageContentProps {
    query: string
}

export const PageContent: React.FC<PageContentProps> = ({query}) => {
    return (
        <>
            <Switch>
                <Route exact path="/">
                    <Home />
                </Route>
            </Switch>
        </>
    );
}