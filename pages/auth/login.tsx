import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { useRouter } from "next/router";
import * as React from 'react';
import { useState } from 'react';
import Copyright from '../../components/Copyright';
import Message from '../../components/Message';
import ProTip from '../../components/ProTip';
import http from '../../src/http/http';

export default function About() {
  const router = useRouter();

  // 如果已经登录，直接跳转到主页
  if (typeof window !== 'undefined' && localStorage.getItem('token')) {
    router.push('/console/home');
  }

  const handleLogin = async (event) => {
    event.preventDefault();
    const { username, password } = event.currentTarget;

    if (!username.value || !password.value) {
      Message.error({ content: "用户名或密码不能为空！", duration: 1000 });
      return;
    }

    const formData = new FormData();
    formData.append('username', username.value.toString());
    formData.append('password', password.value.toString());

    try {
      const response = await http.post('/v1/auth/login', formData);
      // console.log((JSON.parse(JSON.stringify(response.access_token))))
      localStorage.setItem("token", response.access_token)
      router.push('/console/home');
      Message.success({ content: "登录成功,欢迎使用 ME Frp !", duration: 1000})
      } catch (err) {
      Message.error({ content: "失败" + err , duration: 1000 })
    }
  };

  return (
    <React.Fragment>
    <Container maxWidth="lg">
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            登录到 ME Frp
          </Typography>
          <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="邮箱或用户名"
              name="username"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="密码"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              name="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              登录
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/auth/forgot" variant="body2">
                  忘记密码
                </Link>
              </Grid>
              <Grid item>
                <Link href="/auth/register" variant="body2">
                  {"没有账号？ 去注册"}
                </Link>
              </Grid>
            </Grid>
          </Box>
      </Box>
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
          <ProTip />
          <Copyright />
        </Container>
              {/* End footer */}
              </React.Fragment>
  );

}
