import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from './pages/Home'
import Items from './pages/Items'
import NewItem from './pages/Items/NewItem'
import EditItem from './pages/Items/EditItem'
import Users from './pages/Users'
import ListOrders from './pages/Orders/ListOrders'
import NewOrder from './pages/Orders/NewOrder'
import NewRole from './pages/Roles/NewRole'
import Roles from './pages/Roles'
import EditRole from './pages/Roles/EditRole'
import NewMenu from './pages/Menu/NewMenu'
import EditMenu from './pages/Menu/EditMenu'
import Menu from './pages/Menu'

const Routes = () => {
    return (
        <Switch>
            <Route path="/" exact>
                <Home />
            </Route>
            <Route path="/items/edit/:id" exact>
                <EditItem />
            </Route>
            <Route path="/items/new" exact>
                <NewItem />
            </Route>
            <Route path="/items" exact>
                <Items />
            </Route>
            <Route path="/users" exact>
                <Users />
            </Route>
            <Route path="/orders/new">
                <NewOrder />
            </Route>
            <Route path="/orders" exact>
                <ListOrders />
            </Route>
            <Route path="/roles/edit/:id" exact>
                <EditRole />
            </Route>
            <Route path="/roles/new" exact>
                <NewRole />
            </Route>
            <Route path="/roles/" exact>
                <Roles />
            </Route>
            <Route path="/menu/new" exact>
                <NewMenu />
            </Route>
            <Route path="/menu/" exact>
                <Menu />
            </Route>
            <Route path="/menu/edit/:id" exact>
                <EditMenu />
            </Route>
            <Route>
                <h1>Página não encontrada</h1>
            </Route>
        </Switch>
    )
}

export default Routes