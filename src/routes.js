import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from './pages/Home'
import Items from './pages/Items'
import NewItem from './pages/Items/NewItem'
import EditItem from './pages/Items/EditItem'
import Users from './pages/Users'

const Routes = () => {
    return (
        <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/items" exact component={Items} />
            <Route path="/items/new" exact component={NewItem} />
            <Route path="/items/edit/:id" exact component={EditItem} />
            <Route path="/users" exact component={Users} />
        </Switch>
    )
}

export default Routes