import React from 'react'
import { Route, Switch } from 'react-router-dom'

interface PageContentProps {
    query: string
}

export const PageContent: React.FC<PageContentProps> = ({query}) => {
    return (
        <>
            <Switch>
                <Route exact path="/">
                    {/* Home page */}
                </Route>
            </Switch>
        </>
    );
}