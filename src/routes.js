import React from 'react'
import { Switch, Route } from 'react-router-dom'
import {paths} from './utils/routePaths'

const Routes = () => {
    return (
        <Switch>
            {paths.map(path => (
                <Route key={path.path} path={path.path} exact={path.exact}>
                    {path.component}
                </Route>
            ))}
            <Route>
                <h1>Página não encontrada</h1>
            </Route>
        </Switch>
    )
}

export default Routes