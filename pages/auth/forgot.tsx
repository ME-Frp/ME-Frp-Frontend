import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import * as React from 'react';
import Copyright from '../../components/Copyright';
import Message from '../../components/Message';
import http from '../../src/http/http';

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function SignUp() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

  // 获取输入的邮箱地址
  const email = data.get('email');
  // 获取输入的用户名
  const username = data.get('username');
  // 设定为表单数据
  if (email == "" || username == "" ) {
  Message.error({content: "请填写完整信息！", duration: 1000})
  } else {
  const formData = new FormData();
  formData.append('email', email.toString());
  formData.append('username', username.toString());
  // 发送请求
  http.post('/v1/auth/forgot_password', formData)
  .then(res => {
  Message.success({content: "重置链接发送成功！", duration: 1000})
  }).catch(err => {
    if (err.response.status == 400) {
      Message.error({content: "发送失败，请检查信息是否正确！", duration: 1000})
      }});
    };

  };
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            忘记密码
          </Typography>
          <Box component="form" noValidate sx={{ mt: 3 }} onSubmit={handleSubmit}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="username"
                  required
                  fullWidth
                  id="username"
                  label="用户名"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="邮箱地址"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              </Grid>
            <Button
              type="submit"
              fullWidth
              id="reg"
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              发送重置链接到邮箱
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/auth/login" variant="body2">
                  我想起来了！登录
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright/>
      </Container>
    </ThemeProvider>
  );
}