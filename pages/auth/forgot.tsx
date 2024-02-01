import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {Avatar, Box, Button, Container, CssBaseline, Grid, Link, Paper, TextField, Typography} from '@mui/material';
import * as React from 'react';
import Copyright from '../../src/components/Copyright';
import Message from '../../src/components/Message';
import http from '../../src/http/http';

export default function Forgot() {
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const {username, email} = event.currentTarget;


        // 设定为表单数据
        if (email == '' || username == '') {
            Message.error({content: '请填写完整信息！', duration: 1000});
        } else {
            const formData = new FormData();
            formData.append('email', email.toString());
            formData.append('username', username.toString());
            try {
                // 发送请求
                const res = await http.post('/v4/public/verify/forgot_password', formData);
                Message.success({content: res.message, duration: 1000});
            } catch (err: any) {
                if (err.response) {
                    Message.error({content: '发送失败，' + err.response.data.message, duration: 1000});
                }
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
                        忘记密码
                    </Typography>
                    <Box component="form" noValidate sx={{mt: 1}} onSubmit={handleSubmit}
                    >
                        <TextField
                            autoComplete="given-name"
                            margin="normal"
                            name="username"
                            required
                            fullWidth
                            id="username"
                            label="用户名"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="邮箱地址"
                            name="email"
                            autoComplete="email"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            id="reg"
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
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
