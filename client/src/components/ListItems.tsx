import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ImageSearchIcon from '@material-ui/icons/ImageSearch';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import PeopleIcon from '@material-ui/icons/People';
import RedeemIcon from '@material-ui/icons/Redeem';
import React from 'react';
import NavLinkMui from './NavLinkMui';
export const mainListItems = (
  <div>
    <ListItem button component={NavLinkMui} to="/">
      <ListItemIcon >
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Add cashback rules" />
    </ListItem>
    <ListItem button component={NavLinkMui} to="/add-users">
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Add users" />
    </ListItem>
    <ListItem button component={NavLinkMui} to="/assign-curators">
      <ListItemIcon>
        <AssignmentIndIcon />
      </ListItemIcon>
      <ListItemText primary="Assign curator" />
    </ListItem>
    <ListItem button component={NavLinkMui} to="/add-product">
      <ListItemIcon>
        <LibraryAddIcon />
      </ListItemIcon>
      <ListItemText primary="Add product" />
    </ListItem>
    <ListItem button component={NavLinkMui} to="/manage-claims">
      <ListItemIcon>
        <RedeemIcon />
      </ListItemIcon>
      <ListItemText primary="Manage claims" />
    </ListItem>
    <ListItem button component={NavLinkMui} to="/manage-claims">
      <ListItemIcon>
        <ImageSearchIcon />
      </ListItemIcon>
      <ListItemText primary="Search claims" />
    </ListItem>
  </div>
);
