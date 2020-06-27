import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import HomeIcon from '@material-ui/icons/Home'
import { Switch, Route, Link as RouterLink } from 'react-router-dom'

function ListItemLink(props) {
  const { icon, primary, to } = props;

  const renderLink = React.useMemo(
    () => React.forwardRef((itemProps, ref) => <RouterLink to={to} ref={ref} {...itemProps} />),
    [to],
  );

  return (
    <li>
      <ListItem button component={renderLink}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
}

export const mainListItems = (
  <div>
    <ListItemLink primary="Início" to="/" icon={<HomeIcon />} />
    <ListItemLink primary="Pedidos" to="/items" icon={<ShoppingCartIcon />} />
    <ListItemLink primary="Usuários" to="/users" icon={<PeopleIcon />} />
    <ListItemLink primary="Relatórios" to="/reports" icon={<BarChartIcon />} />
    <Switch>
      <Route path="/" component={this} />
    </Switch>
  </div>
);
