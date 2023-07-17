import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Avatar, Checkbox, FormControlLabel, Grid, Link } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useRouter } from "next/router";
import * as React from 'react';
import { useState } from 'react';
import Copyright from '../../components/Copyright';
import Message from '../../components/Message';
import http from '../../src/http/http';
export default function About() {
  const [Loginres, setLoginres] = useState(null);
// 登录处理 核心代码 如果存在本地 Token 则进行验证
// 仅让客户端执行
if (typeof window !== 'undefined') {
if (localStorage.getItem("token") != null) {
  const token = localStorage.getItem("token");
  Message.success({content: "您已登录，正在验证登录有效性……", duration: 1000})
  setTimeout(() => {
    VerifyToken(token)
  },1000)
}
}
const Login =  (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
      // 获取下方两个输入框的值
      const username = data.get('username');
      const password = data.get('password');
      // 判断是否为空
      if (username == "" || password == "") {
        Message.error({content: "用户名或密码不能为空！", duration: 1000})
      } 
      // 使用 formdata 进行登录
      const formData = new FormData();
      formData.append('username', username.toString());
      formData.append('password', password.toString());
      http.post('/v1/auth/login', formData)
      .then(res => {
        setLoginres(res);
        const token = Loginres.access_token;
        Message.success({content: "获取到 Token , 正在对其有效性进行验证", duration: 1000})
        setTimeout(() => {
        VerifyToken(token)
       }, 1000)
       console.log("登录成功！")
}).catch(err => {
  if (err.response.status != null) {
  if (err.response.status == 401) {
    Message.error({content: "登录失败，用户名或密码错误！", duration: 1000})
  }
}
})
}
const router = useRouter(); 
// 验证代码：需要携带 token 进行验证 ？是否可以先存储 此处直接getitem验证？
function VerifyToken(token) {
  localStorage.setItem('token', token);
  http.get('/v2/user')
  .then(res => {
    Message.success({content: "登录成功，正在重定向……", duration: 1000})
    setTimeout(() => {
    router.push('/Panel/home')
   }, 1000)
   console.log("登录成功！");
})
.catch(err => {
  localStorage.removeItem('token')
  Message.error({content: '登录遇到问题，密钥可能过期，请重新登录！', duration: 1000})
})
}
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
          <Box component="form" onSubmit={Login} noValidate sx={{ mt: 1 }}>
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
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="记住密码"
            />
            <Button
              type="submit"
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
          <Copyright />
        </Container>
              {/* End footer */}
              </React.Fragment>
  );

}
