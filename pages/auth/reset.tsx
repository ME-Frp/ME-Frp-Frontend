import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {
    Avatar,
    Box,
    Button,
    Container,
    CssBaseline,
    Grid,
    Link,
    TextField,
    Typography,
    Paper,
} from '@mui/material';
import { useRouter } from 'next/router';
import * as React from 'react';
import Copyright from '../../src/components/Copyright';
import Message from '../../src/components/Message';
import http from '../../src/http/http';


export default function SignUp() {
    const router = useRouter();
    const query = router.query;
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // 获取密码
        const {password} = event.currentTarget;

        // 获取地址栏中的参数token
        const token = query.token;

        // 表单验证
        if (password.value === '' || token === '') {
            Message.error({ content: '请填写完整信息！', duration: 1000 });
            return;
        }

        try {
            const formData = new FormData();
            formData.append('password', password.value.toString());

            // 发送异步请求
            const res = await http.post(`/v4/public/verify/reset_password/${token}`, formData);
            Message.success({ content: res.message, duration: 1000 });
        } catch (err: any) {
            if (err.response) {
                Message.error({ content: "重置失败，" + err.response.data.message , duration: 1000 })
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