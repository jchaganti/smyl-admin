import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ImageSearchIcon from '@material-ui/icons/ImageSearch';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import PeopleIcon from '@material-ui/icons/People';
import RedeemIcon from '@material-ui/icons/Redeem';
import React, { FunctionComponent } from 'react';
import NavLinkMui from './NavLinkMui';
import { ROLES } from '../models';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
interface MainListItemsProps {
  role: string;
}
export const MainListItems: FunctionComponent<MainListItemsProps> = ({ role }: MainListItemsProps) => {
  return (<div>
    {role === ROLES.ADMIN && <ListItem button component={NavLinkMui} to="/">
      <ListItemIcon >
        <AddShoppingCartIcon />
      </ListItemIcon>
      <ListItemText primary="Add retailer" />
    </ListItem>}
    {role === ROLES.ADMIN && <ListItem button component={NavLinkMui} to="/add-cashback-rules">
      <ListItemIcon >
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Add cashback rules" />
    </ListItem>}
    {role === ROLES.ADMIN && <ListItem button component={NavLinkMui} to="/add-users">
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Add users" />
    </ListItem>}
    {role === ROLES.ADMIN && <ListItem button component={NavLinkMui} to="/assign-curators">
      <ListItemIcon>
        <AssignmentIndIcon />
      </ListItemIcon>
      <ListItemText primary="Manage retailers" />
    </ListItem>}
    {(role === ROLES.ADMIN || role === ROLES.CURATOR) && <ListItem button component={NavLinkMui} to="/add-product">
      <ListItemIcon>
        <LibraryAddIcon />
      </ListItemIcon>
      <ListItemText primary="Add product" />
    </ListItem>}
    {(role === ROLES.ADMIN || role === ROLES.PAYMENT_MANAGER) && <ListItem button component={NavLinkMui} to="/manage-claims">
      <ListItemIcon>
        <RedeemIcon />
      </ListItemIcon>
      <ListItemText primary="Manage claims" />
    </ListItem>}
    {(role === ROLES.ADMIN || role === ROLES.PAYMENT_MANAGER) && <ListItem button component={NavLinkMui} to="/search-claims">
      <ListItemIcon>
        <ImageSearchIcon />
      </ListItemIcon>
      <ListItemText primary="Search claims" />
    </ListItem>}
  </div>)
};
