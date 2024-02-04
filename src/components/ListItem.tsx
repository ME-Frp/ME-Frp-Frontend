import {
    AccountCircle,
    AddCircle,
    AssignmentTurnedIn,
    Download,
    Home,
    List,
    TextSnippet,
    VolunteerActivism,
    Storage,
} from '@mui/icons-material';
import {ListItemButton, ListItemIcon, ListItemText} from '@mui/material';
import * as React from 'react';

const FirstListItem = [
    {
        title: "首页",
      path: "/console/home",
        icon: <Home/>,
    },
    {
        title: "用户信息",
        path: "/console/user/info",
        icon: <AccountCircle/>
    },
    {
      title: " 每日签到",
      path: "/console/user/sign",
      icon: <AssignmentTurnedIn />,
    },
    {
      title: "赞助我们",
      path: "/console/sponsor",
      icon: <VolunteerActivism />,
    },
  ];
const SecondListItem = [
    {
      title: "隧道列表",
      path: "/console/tunnel/list",
      icon: <List />,
    },
    {
      title: "创建隧道",
      path: "/console/tunnel/create",
      icon: <AddCircle />,
    },
    {
      title:  "配置文件",
      path: "/console/tunnel/config",
      icon: <TextSnippet />,
    },
    {
      title: "文件下载",
        path: "/download",
      icon: <Download />,
    },
    {
        title: "节点状态",
        path: "/console/status",
        icon: <Storage />,
    }
  ];
export const FirstList = (
  <React.Fragment>
      {FirstListItem.map((page) => (
          <ListItemButton color="inhert" key={page.title} component="a" href={page.path}>
                  <ListItemIcon>{page.icon}</ListItemIcon>
                  <ListItemText primary={page.title} />
          </ListItemButton>
              ))}
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
      {SecondListItem.map((page) => (
          <ListItemButton key={page.title} component="a" href={page.path}>
                  <ListItemIcon>{page.icon}</ListItemIcon>
                  <ListItemText primary={page.title} />
          </ListItemButton>
              ))}
  </React.Fragment>
);