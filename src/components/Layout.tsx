// Material-UI
import { ChevronLeft as ChevronLeftIcon, Logout, Menu as MenuIcon } from '@mui/icons-material';
import {
    Box,
    Container,
    CssBaseline,
    Divider,
    Grid,
    IconButton,
    List,
    AppBar as MuiAppBar,
    AppBarProps as MuiAppBarProps,
    Drawer as MuiDrawer,
    Toolbar,
    Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
// React
import * as React from 'react';
import { ReactNode, useEffect } from 'react';
// Next.js
import { useRouter } from 'next/router';
// Components
import Copyright from './Copyright';
import { FirstList, secondaryListItems } from "./ListItem";


const drawerWidth = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);
interface LayoutProps {
  children: ReactNode;
}
const Layout = ({ children }: LayoutProps) => {
    // 修改这里将 open 的初始状态设置为 true
    const [open, setOpen] = React.useState(window.innerWidth >= 768); // 默认

    useEffect(() => {
        // 定义一个函数来检查屏幕宽度并设置open状态
        const checkWidthAndUpdateOpen = () => {
            const isDesktop = window.innerWidth >= 768; // 假设宽度大于等于768px为桌面设备
            setOpen(isDesktop);
        };

        // 在组件挂载时执行一次检查
        checkWidthAndUpdateOpen();

        // 可以监听resize事件
        window.addEventListener('resize', checkWidthAndUpdateOpen);

        // 组件卸载时移除事件监听
        return () => window.removeEventListener('resize', checkWidthAndUpdateOpen);
    }, []); // 空依赖数组确保effect只在挂载时运行

    const toggleDrawer = () => {
        setOpen(!open);
    };
    const router = useRouter();
    return (
        <Box sx={{display: 'flex'}}>
            <CssBaseline/>
            <AppBar position="absolute" open={open}>
                <Toolbar
                    sx={{
                        pr: '24px', // keep right padding when drawer closed
                    }}
                >
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={toggleDrawer}
                        sx={{
                            marginRight: '36px',
                            ...(open && {display: 'none'}),
                        }}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography
                        component="h1"
                        variant="h6"
                        color="inherit"
                        noWrap
                        sx={{flexGrow: 1}}
                    >
                        ME Frp
                    </Typography>
                    <IconButton
                        color="inherit"
                        onClick={() => {
                            localStorage.removeItem('token');
                            router.push('/auth/login').then()
                        }
                        }
                    >
                        <Logout/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <Toolbar
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        px: [1],
                    }}
                >
                    <IconButton onClick={toggleDrawer}>
                        <ChevronLeftIcon/>
                    </IconButton>
                </Toolbar>
                <Divider/>
                <List component="nav">
                    {FirstList}
                    <Divider sx={{my: 1}}/>
                    {secondaryListItems}
                </List>
            </Drawer>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                }}
            >
                <Toolbar/>
                <Container maxWidth="lg" sx={{mt: 4, mb: 4}}>
                    <Grid container spacing={3}>
                    </Grid>
                    {/*导入页面*/}
                    <main>
                        {children}
                    </main>
                </Container>
                <Container
                    maxWidth="md"
                    component="footer"
                    sx={{
                        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                        mt: 8,
                        py: [3, 6],
                    }}
                >
                    <Copyright/>
                </Container>
            </Box>
        </Box>
    );
}
export default Layout;