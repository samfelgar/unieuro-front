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
import MyOrders from "./pages/Orders/MyOrders";
import OrderDetail from "./pages/Orders/OrderDetail";
import NewMenu from './pages/Menu/NewMenu'
import EditMenu from './pages/Menu/EditMenu'
import Menu from './pages/Menu'
import NewUser from "./pages/Users/NewUser";
import EditUser from "./pages/Users/EditUser"
import RedefinePass from "./pages/Users/RedefinePass";

const Routes = () => {
    return (
        <Switch>
            <Route path="/" exact>
                <Home />
            </Route>
            <Route path="/items/edit/:id">
                <EditItem />
            </Route>
            <Route path="/items/new">
                <NewItem />
            </Route>
            <Route path="/items">
                <Items />
            </Route>
            <Route path="/users/myorders">
                <MyOrders />
            </Route>
            <Route path="/users/new">
                <NewUser />
            </Route>
            <Route path="/users/edit/:id">
                <EditUser />
            </Route>
            <Route path="/users/:id/redefine">
                <RedefinePass />
            </Route>
            <Route path="/users">
                <Users />
            </Route>
            <Route path="/orders/detail/:id">
                <OrderDetail />
            </Route>
            <Route path="/orders/new">
                <NewOrder />
            </Route>
            <Route path="/orders" exact>
                <ListOrders />
            </Route>
            <Route path="/roles/edit/:id">
                <EditRole />
            </Route>
            <Route path="/roles/new">
                <NewRole />
            </Route>
            <Route path="/roles/">
                <Roles />
            </Route>
            <Route path="/menus/edit/:id">
                <EditMenu />
            </Route>
            <Route path="/menus/new">
                <NewMenu />
            </Route>
            <Route path="/menus/">
                <Menu />
            </Route>
            <Route>
                <h1>Página não encontrada</h1>
            </Route>
        </Switch>
    )
}

export default Routes