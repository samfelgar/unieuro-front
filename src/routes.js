import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from './pages/Home'
import Items from './pages/Items'
import Users from './pages/Users'

const Routes = () => {
    return (
        <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/items" exact component={Items} />
            <Route path="/users" exact component={Users} />
        </Switch>
    )
}

export default Routes