import React from "react";
import Home from "../pages/Home";
import EditItem from "../pages/Items/EditItem";
import Lots from "../pages/Lots/ListLots";
import NewItem from "../pages/Items/NewItem";
import Items from "../pages/Items";
import NewLot from "../pages/Lots/NewLot";
import EditLot from "../pages/Lots/EditLot";
import MyOrders from "../pages/Orders/MyOrders";
import NewUser from "../pages/Users/NewUser";
import EditUser from "../pages/Users/EditUser";
import RedefinePass from "../pages/Users/RedefinePass";
import Users from "../pages/Users";
import DispatchOrder from "../pages/Orders/DispatchOrder";
import OrderDetail from "../pages/Orders/OrderDetail";
import NewOrder from "../pages/Orders/NewOrder";
import ListOrders from "../pages/Orders/ListOrders";
import EditRole from "../pages/Roles/EditRole";
import NewRole from "../pages/Roles/NewRole";
import Roles from "../pages/Roles";
import EditMenu from "../pages/Menu/EditMenu";
import NewMenu from "../pages/Menu/NewMenu";
import Menu from "../pages/Menu";
import Permissions from "../pages/Permissions";

export const paths = [
    {path: '/', exact: true, component: <Home />},
    {path: '/items/edit/:id', exact: false, component: <EditItem />},
    {path: '/items/:itemId/lots', exact: false, component: <Lots />},
    {path: '/items/new', exact: false, component: <NewItem />},
    {path: '/items', exact: false, component: <Items />},
    {path: '/lots/new', exact: false, component: <NewLot />},
    {path: '/lots/edit/:lotId', exact: false, component: <EditLot />},
    {path: '/users/myorders', exact: false, component: <MyOrders />},
    {path: '/users/new', exact: false, component: <NewUser />},
    {path: '/users/edit/:id', exact: false, component: <EditUser />},
    {path: '/users/:id/redefine', exact: false, component: <RedefinePass />},
    {path: '/users', exact: false, component: <Users />},
    {path: '/orders/:orderId/items/lots', exact: false, component: <DispatchOrder />},
    {path: '/orders/detail/:id', exact: false, component: <OrderDetail />},
    {path: '/orders/myorders', exact: false, component: <MyOrders />},
    {path: '/orders/new', exact: false, component: <NewOrder />},
    {path: '/orders', exact: false, component: <ListOrders />},
    {path: '/roles/edit/:id', exact: false, component: <EditRole />},
    {path: '/roles/new', exact: false, component: <NewRole />},
    {path: '/roles', exact: false, component: <Roles />},
    {path: '/menus/edit/:id', exact: false, component: <EditMenu />},
    {path: '/menus/new', exact: false, component: <NewMenu />},
    {path: '/menus', exact: false, component: <Menu />},
    {path: '/permissions', exact: false, component: <Permissions />},
]