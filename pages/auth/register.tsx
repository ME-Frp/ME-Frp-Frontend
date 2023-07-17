import { LockOutlined, Send } from '@mui/icons-material';
import { Avatar, Box, Button, Container, CssBaseline, Grid, Link, TextField, Typography } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { NextPage } from 'next';
import { useState } from 'react';
import Copyright from '../../components/Copyright';
import Message from '../../components/Message';
import http from '../../src/http/http';

const theme = createTheme();

const SignUp: NextPage = () => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [coderes, setCoderes] = useState(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // 防止重复点击
    setSubmitDisabled(true);
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    try {
      const email = data.get('email');
      const username = data.get('username');
      const password = data.get('password');
      const code = data.get('code');

      if (!email || !username || !password || !code) {
        Message.error({ content: '请填写完整信息！', duration: 1000 });
        setSubmitDisabled(false);
        return;
      }

      const formData = new FormData();
      formData.append('email', email.toString());
      formData.append('username', username.toString());
      formData.append('password', password.toString());
      formData.append('code', code.toString());

      // 发送注册请求
      const res = await http.post('/v1/auth/register', formData);
      Message.success({ content: '注册成功！', duration: 1000 });
    } catch (error) {
      setSubmitDisabled(false);
      if (error.response && error.response.status == 400) {
        Message.error({ content: '注册失败，请检查信息是否正确！', duration: 1000 });
      } else {
        Message.error({ content: '注册失败，请稍后再试！', duration: 1000 });
      }
    }
  };

  const handleSendCode = async () => {
    // 防止重复点击
    setIsDisabled(true);
    // 获取邮箱地址
    const data = new FormData(document.getElementById('form') as HTMLFormElement);
    const email = data.get('email');

    if (!email) {
      Message.error({ content: '邮箱地址不能为空！', duration: 1000 });
      setIsDisabled(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('email', email.toString());

      // 发送验证码请求
      const res = await http.post('/v1/auth/reg/email', formData);
      setCoderes(res);
      setIsDisabled(true);
      Message.success({ content: '验证码发送成功！', duration: 1000 });
    } catch (error) {
      setIsDisabled(false);
      if (error.response && error.response.status == 500) {
        Message.error({ content: '验证码发送失败，' + error.response.data.message , duration: 1000 });
      } else {
        Message.error({ content: '验证码发送失败，请稍后再试！' + error.response.data.message, duration: 1000 });
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
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
            <LockOutlined />
          </Avatar>
          <Typography component="h1" variant="h5">
            注册 ME Frp 账号
          </Typography>
          <Box component="form" id="form" noValidate sx={{ mt: 3 }} onSubmit={handleSubmit}>
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
              <Grid item xs={12}>
  <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', height: '48px' }}>
    <TextField
      required
      id="code"
      label="验证码"
      name="code"
      sx={{ flex: 1, height: '100%' }}
    />
    <Button
      type="button"
      variant="contained"
      disabled={isDisabled}
      onClick={handleSendCode}
      sx={{ flex: 1, height: '100%' }}
      endIcon={<Send />}
    >
      发送验证码
    </Button>
  </Box>
</Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="密码"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Button disabled={submitDisabled} type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              注册
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/auth/login" variant="body2">
                  已经有帐号了？登录
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright />
      </Container>
    </ThemeProvider>
  );
};

export default SignUp;