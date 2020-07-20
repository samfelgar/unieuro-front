import React, {useState, useEffect} from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {Switch, Route, Link as RouterLink} from 'react-router-dom'
import HomeIcon from '@material-ui/icons/Home'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import api from '../../services/api'

const ListItemLink = (props) => {
    const {icon, primary, to} = props;

    const renderLink = React.useMemo(
        () => React.forwardRef((itemProps, ref) => <RouterLink to={to} ref={ref} {...itemProps} />),
        [to],
    );

    return (
        <li>
            <ListItem button component={renderLink}>
                {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
                <ListItemText primary={primary}/>
            </ListItem>
        </li>
    );
}

const MainListItems = ({logout}) => {

    const [menuItems, setMenuItems] = useState([])

    useEffect(() => {
        api.get('/menus')
            .then((response) => {
                setMenuItems(response.data)
            })
    }, [])



    return (
        <div>
            <ListItemLink primary="Início" to="/" icon={<HomeIcon/>}/>
            {menuItems.map((item) => {
                return <ListItemLink primary={item.name} to={item.path} key={item.id} icon={<ChevronRightIcon/>}/>
            })}
            <ListItem button onClick={logout}>
                <ListItemIcon>
                    <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText>Sair</ListItemText>
            </ListItem>
            <Switch>
                <Route path="/" component={this}/>
            </Switch>
        </div>
    )
}

export default MainListItems