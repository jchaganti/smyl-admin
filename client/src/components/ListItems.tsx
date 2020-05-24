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
export const mainListItems = (
  <div>
    <ListItem button>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Add cashback rules" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Add users" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIndIcon />
      </ListItemIcon>
      <ListItemText primary="Assign curator" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <LibraryAddIcon />
      </ListItemIcon>
      <ListItemText primary="Add product" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <RedeemIcon />
      </ListItemIcon>
      <ListItemText primary="Manage claims" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <ImageSearchIcon />
      </ListItemIcon>
      <ListItemText primary="Search claims" />
    </ListItem>
  </div>
);
