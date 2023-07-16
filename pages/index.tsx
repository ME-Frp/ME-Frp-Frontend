import { Typography } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import Toolbar from '@mui/material/Toolbar';
import * as React from 'react';
import { useState } from 'react';
import Copyright from '../components/Copyright';

export default function Home() {
  const task = useState();
  return (
     <React.Fragment>
      <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
      <CssBaseline />
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
      >
        <Toolbar sx={{ flexWrap: 'wrap' }}> 
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            ME Frp 镜缘映射
          </Typography>
          <Button href="auth/login" variant="outlined" sx={{ my: 1, mx: 1.5 }}>
            注册
          </Button>
        </Toolbar>
      </AppBar>
      {/* Hero unit */}
      <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
        <Typography
          component="h2"
          variant="h4"
          align="center"
          color="text.primary"
          gutterBottom
        >
          ME Frp 镜缘映射
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" component="p">
        免费 公益 好用 低延迟 稳定的Frp内网穿透
        </Typography>
              <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
            <Box maxWidth="sm">
          <Button variant="contained" href="auth/login">
            开始使用
          </Button>
        </Box>
        </Box>
      </Container>
      {/* Footer */}
      <Container
        maxWidth="md"
        component="footer"
        sx={{
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          mt: 8,
          py: [3, 6],
        }}
      >
        <Copyright />
      </Container>
      {/* End footer */}
          </React.Fragment>
  );
}
