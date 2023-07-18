import { AccountCircle, AddCircle, AssignmentTurnedIn, Download, HowToReg, List, TextSnippet, VolunteerActivism } from '@mui/icons-material';
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
    },
    {
      title: "赞助我们",
      path: "/Panel/User/sponsor",
      icon: <VolunteerActivism />,
      component: Profile,
    },
    {
      title: "实名认证",
      path: "/Panel/User/realname",
      icon: <HowToReg />,
      component: Profile,
    },
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
    },
    {
      title: "文件下载",
      path: "/Panel/Download",
      icon: <Download />,

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