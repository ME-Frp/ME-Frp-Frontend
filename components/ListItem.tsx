import { Dashboard } from '@mui/icons-material';
import { ListItem, ListItemIcon, ListItemText } from '@mui/material';
import * as React from 'react';
import Profile from '../pages/Panel/home/Profile';

const mainpages = [
    {
      title: "Home",
      path: "/",
      icon: <Dashboard />,
      component: Profile,
    }
  ];
export default mainpages;
const secondarypages = [
    {
      title: "Home",
      path: "/",
      icon: <Dashboard />,
      component: Profile,
    }
  ];
export const mainListItems = (
  <React.Fragment>
                 {mainpages.map((page) => (
                <ListItem button key={page.title} component="a" href={page.path}>
                  <ListItemIcon>{page.icon}</ListItemIcon>
                  <ListItemText primary={page.title} />
                </ListItem>
              ))}
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
                 {secondarypages.map((page) => (
                <ListItem button key={page.title} component="a" href={page.path}>
                  <ListItemIcon>{page.icon}</ListItemIcon>
                  <ListItemText primary={page.title} />
                </ListItem>
              ))}
  </React.Fragment>
);