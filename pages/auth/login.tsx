import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {Avatar, Box, Button, Container, CssBaseline, Grid, Link, Paper, TextField, Typography} from '@mui/material';
import {useRouter} from "next/router";
import * as React from 'react';
import Copyright from '../../src/components/Copyright';
import Message from '../../src/components/Message';
import ProTip from '../../src/components/ProTip';
import http from '../../src/http/http';

export default function Login() {
    const router = useRouter();

    // 如果已经登录，直接跳转到主页
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
        router.push('/console/home');
    }

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const {username, password} = event.currentTarget;

        if (!username.value || !password.value) {
            Message.error({content: "用户名或密码不能为空！", duration: 1000});
            return;
        }

        const formData = new FormData();
        formData.append('username', username.value.toString());
        formData.append('password', password.value.toString());

        try {
            const response = await http.post('/v4/public/verify/login', formData);
            // console.log((JSON.parse(JSON.stringify(response.access_token))))
            localStorage.setItem("token", response.data.access_token)
            router.push('/console/home');
            Message.success({content: response.message, duration: 1000})
        } catch (error: any) {
            if (error.response) {
                Message.error({content: `登录失败，${error.response.data.message}`, duration: 1000})
            }
        }
    };

    return (
        <Grid container component="main" sx={{height: '100vh'}}>
            <CssBaseline/>
            <Grid
                item
                xs={false}
                sm={4}
                md={7}
                sx={{
                    backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: (t) =>
                        t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <Box
                    sx={{
                        my: 8,
                        mx: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        登录到 ME Frp
                    </Typography>
                    <Box component="form" onSubmit={handleLogin} noValidate sx={{mt: 1}}>
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
                            sx={{mt: 3, mb: 2}}
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
                    <ProTip/>
                </Box>
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
            </Grid>
        </Grid>


    );

}
