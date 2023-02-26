import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useRouter } from "next/router";
import * as React from 'react';
import Copyright from '../../components/Copyright';
import Message from '../../components/Message';
import api from '../../src/config/config';
import http from '../../src/http/http';
export default function About() {
// 登录处理 核心代码 如果存在本地 Token 则进行验证 不存在则前往 LaeCloud 进行登录
function Login() {
    // protocol + domain + pathname
    if (localStorage.getItem("token") != null) {
      const token = localStorage.getItem("token");
      Message.success({content: "您已登录，正在验证登录有效性……", duration: 1000})
      setTimeout(() => {
        VerifyToken(token)
      },1000)
    } else {
    // const redirect = location.origin + location.pathname
    // 正常版本
    const redirect = "https://panel.portio.cn/auth/login"
    // dev
    window.location.href =
        api.auth + '/?callback=' + encodeURIComponent(redirect)
    }
}
const router = useRouter(); 
const query = router.query

// Token 获取：从 回调 url 中检测 Token 非 null 时将 Token 定义为 token 字段，并传递 Token 进行验证
if (query.token != null) {
const token = query.token as string
VerifyToken(token);
}
// 验证代码：需要携带 token 进行验证 ？是否可以先存储 此处直接getitem验证？
function VerifyToken(token) {
  localStorage.setItem('token', token);
  http.get('/user')
  .then(res => {
    Message.success({content: "登录成功，正在重定向……", duration: 1000})
    setTimeout(() => {
    router.push('/Panel/home')
   }, 1000)
   console.log("登录成功！");
})
.catch(err => {
  localStorage.removeItem('token')
  Message.error({content: '登录遇到问题，密钥可能过期，正在为您重新登录！', duration: 1000})
  setTimeout(() => {
  Login();
  },1000)
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
        <Typography variant="h4" component="h1" gutterBottom>
          欢迎使用 PortIO 联合映射
        </Typography>
        <Box maxWidth="sm">
          <Button variant="contained" onClick = {Login}>
            去登录
          </Button>
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
