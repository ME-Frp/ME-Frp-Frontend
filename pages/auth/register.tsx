import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import SendIcon from '@mui/icons-material/Send';
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
import { useState } from 'react';
import Copyright from '../../components/Copyright';
import Message from '../../components/Message';
import http from '../../src/http/http';

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function SignUp() {
  const [isDisabled, setIsDisabled] = useState(false);
  const [coderes, setcoderes] = useState(null);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // 识别点击的按钮 通过id
    // 获取两个按钮元素
const sendCodeButton = document.getElementById('sendcode');
const registerButton = document.getElementById('reg');

// 给发送验证码按钮绑定点击事件监听
sendCodeButton.addEventListener('click', function() {
// 获取输入的邮箱地址
const email = data.get('email');
// 设定为表单数据
if (email == "") {
Message.error({content: "邮箱地址不能为空！", duration: 1000})
} else {
const formData = new FormData();
formData.append('email', email.toString());
// 发送请求
http.post('/v1/auth/reg/email', formData)
.then(res => {
setcoderes(res);
Message.success({content: "验证码发送成功！", duration: 1000})
// 将按钮设置为不可用
setIsDisabled(true);
}).catch(err => {
  if (err.response.status == 500) {
    Message.error({content: "验证码发送失败，请检查邮箱地址是否正确！", duration: 1000})
    setIsDisabled(true);
    }});
  }
});

// 给注册按钮绑定点击事件监听
registerButton.addEventListener('click', function() {
  // 获取输入的邮箱地址
  const email = data.get('email');
  // 获取输入的用户名
  const username = data.get('username');
  // 获取输入的密码
  const password = data.get('password');
  // 获取输入的验证码
  const code = data.get('code');
  // 设定为表单数据
  if (email == "" || username == "" || password == "" || code == "") {
  Message.error({content: "请填写完整信息！", duration: 1000})
  } else {
  const formData = new FormData();
  formData.append('email', email.toString());
  formData.append('username', username.toString());
  formData.append('password', password.toString());
  formData.append('code', code.toString());
  // 发送请求
  http.post('/v1/auth/register', formData)
  .then(res => {
  Message.success({content: "注册成功！", duration: 1000})
  }).catch(err => {
    if (err.response.status == 400) {
      Message.error({content: "注册失败，请检查信息是否正确！", duration: 1000})
      }});
    }
  });

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
            注册 ME Frp 账号
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
                <Grid item xs={12}>
                 <TextField
                  required
                  id="code"
                  label="验证码"
                  name="code"
                  sx={{width: "50%" }}
                />
                {/* 使得二者在同一行 并空开一部分 */}
                <Button
                type="submit"
                    variant="contained"
                    id="sendcode"
                    disabled={isDisabled}
                    sx={{width: "50%", height: "100%"}}
                    endIcon={<SendIcon/>}
                    // 使按钮靠右
                    >
                    发送验证码
                </Button>
</Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
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
        <Copyright/>
      </Container>
    </ThemeProvider>
  );
}