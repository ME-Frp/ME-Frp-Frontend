import {
    Avatar,
    Box,
    Button,
    Container,
    CssBaseline,
    Grid,
    InputAdornment,
    Link,
    Paper,
    TextField,
    Typography
} from '@mui/material';
import * as React from 'react';
import {useState} from 'react';
import Copyright from '../../src/components/Copyright';
import Message from '../../src/components/Message';
import ProTip from '../../src/components/ProTip';
import http from '../../src/http/http';
import {NextPage} from "next";
import {LockOutlined} from "@mui/icons-material";

const SignUp: NextPage = () => {
    const [isDisabled, setIsDisabled] = useState(false);
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [counter, setCounter] = useState(60); // 倒计时秒数，例如60秒

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const {email, username, password, code} = event.currentTarget

        if (!email || !username || !password || !code) {
            Message.error({content: '请填写完整信息！', duration: 1000});
            return;
        }

        // 防止重复点击
        setIsDisabled(true); // 禁用按钮

        try {

            const formData = new FormData();
            formData.append('email', email.value.toString());
            formData.append('username', username.value.toString());
            formData.append('password', password.value.toString());
            formData.append('code', code.value.toString());

            // 发送注册请求
            const res = await http.post('/v4/public/verify/register', formData);
            Message.success({content: res.message, duration: 1000});
        } catch (err: any) {
            setSubmitDisabled(false);
            if (err.response) {
                Message.error({content: "注册失败，" + err.response.data.message, duration: 1000})
            }
        }
    };

    const handleSendCode = async () => {
        // 获取邮箱地址
        const data = new FormData(document.getElementById('form') as HTMLFormElement);
        const email = data.get('email');

        if (!email) {
            Message.error({content: '邮箱地址不能为空！', duration: 1000});
            return;
        }

        // 防止重复点击
        setIsDisabled(true); // 禁用按钮
        let interval = setInterval(() => {
            setCounter((prevCounter) => {
                if (prevCounter <= 1) {
                    clearInterval(interval);
                    setIsDisabled(false); // 重新启用按钮
                    return 60; // 重置倒计时
                }
                return prevCounter - 1;
            });
        }, 1000);

        try {
            const formData = new FormData();
            formData.append('email', email.toString());

            // 发送验证码请求
            const res = await http.post('/v4/public/verify/register/email', formData);
            setIsDisabled(true);
            Message.success({content: res.message, duration: 1000});
        } catch (err: any) {
            setIsDisabled(false);
            if (err.response) {
                Message.error({content: "发送失败，" + err.response.data.message, duration: 1000})
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
                        <LockOutlined/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        注册 KL Frp 账号
                    </Typography>
                    <Box component="form" id="form" noValidate sx={{mt: 1}} onSubmit={handleSubmit}>
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
                            required
                            margin="normal"
                            fullWidth
                            id="email"
                            label="邮箱地址"
                            name="email"
                            autoComplete="email"
                        />
                        <TextField
                            required
                            fullWidth
                            margin="normal"
                            name="code"
                            id="code"
                            label="验证码"
                            inputProps={{'aria-label': '验证码',}}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            disabled={isDisabled}
                                            onClick={handleSendCode}
                                            sx={{
                                                borderTopLeftRadius: 0,
                                                borderBottomLeftRadius: 0,
                                                height: '56px', // 根据TextField默认高度调整
                                                marginLeft: '-1px', // 让按钮与输入框边框重叠，看起来更融合
                                            }}
                                        >
                                            {isDisabled ? `${counter}s` : '发送'}
                                        </Button>
                                    </InputAdornment>
                                ),
                                style: {paddingRight: 0}, // 移除TextField右侧内边距
                            }}

                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="密码"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                        />
                        <Button disabled={submitDisabled} type="submit" fullWidth variant="contained"
                                sx={{mt: 3, mb: 2}}>
                            注册
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/auth/login" variant="body2">
                                    已经有帐号了？登录
                                </Link>
                            </Grid>
                        </Grid>
                        <ProTip/>
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

export default SignUp;
