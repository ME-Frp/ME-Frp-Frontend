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
import { useRouter } from 'next/router';
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
  const router = useRouter();
  const query = router.query;
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    // 获取输入的密码
    const password = data.get('password');
    // 获取地址栏中的参数token
    const token = query.token;
  // 设定为表单数据
  if (password == "" || token == "" ) {
  Message.error({content: "请填写完整信息！", duration: 1000})
  } else {
  const formData = new FormData();
  formData.append('password', password.toString());
  // 发送请求
  http.post('/v1/auth/reset_password/' + token, formData)
  .then(res => {
  Message.success({content: "重置成功！", duration: 1000})
  }).catch(err => {
    if (err.response.status != null) {
    if (err.response.status == 400) {
      Message.error({content: "重置失败，请检查信息是否正确！", duration: 1000})
      }
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
            重置密码
          </Typography>
          <Box component="form" noValidate sx={{ mt: 3 }} onSubmit={handleSubmit}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-password"
                  name="password"
                  type="password"
                  required
                  fullWidth
                  id="password"
                  label="密码"
                  autoFocus
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
               重置密码
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