import { AccountCircle, AddCircle, AssignmentTurnedIn, List, TextSnippet } from '@mui/icons-material';
import { ListItem, ListItemIcon, ListItemText } from '@mui/material';
import * as React from 'react';
import Profile from '../pages/Panel/home';

const mainpages = [
    {
      title: "用户信息",
      path: "/Panel/home",
      icon: <AccountCircle />,
      component: Profile,
    },
    {
      title: " 每日签到",
      path: "/Panel/User/sign",
      icon: <AssignmentTurnedIn />,
      component: Profile,
    }
  ];
export default mainpages;
const secondarypages = [
    {
      title: "隧道列表",
      path: "/Panel/Tunnel/list",
      icon: <List />,
      component: Profile,
    },
    {
      title: "创建隧道",
      path: "/Panel/Tunnel/create",
      icon: <AddCircle />,
    },
    {
      title:  "配置文件",
      path: "/Panel/Tunnel/config",
      icon: <TextSnippet />,
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