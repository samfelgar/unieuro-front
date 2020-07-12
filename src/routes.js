import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from './pages/Home'
import Items from './pages/Items'
import NewItem from './pages/Items/NewItem'
import EditItem from './pages/Items/EditItem'
import Users from './pages/Users'
import ListOrders from './pages/Orders/ListOrders'
import NewOrder from './pages/Orders/NewOrder'
import NewProfile from './pages/Profiles/NewProfile'
import Profile from './pages/Profiles'
import EditProfile from './pages/Profiles/EditProfile'

const Routes = () => {
    return (
        <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/items" exact component={Items} />
            <Route path="/items/new" exact component={NewItem} />
            <Route path="/items/edit/:id" exact component={EditItem} />
            <Route path="/users" exact component={Users} />
            <Route path="/orders" exact component={ListOrders} />
            <Route path="/orders/new" exact component={NewOrder} />
            <Route path="/profiles" exact component={Profile} />
            <Route path="/profiles/new" exact component={NewProfile} />
            <Route path="/profiles/edit/:id" exact component={EditProfile} />
        </Switch>
    )
}

export default Routes