import {
    Alert,
    AlertTitle,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Stack,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import * as React from 'react';
import {useEffect, useState} from 'react';
import Layout from '../../../src/components/Layout';
import Message from '../../../src/components/Message';
import apiClient from '../../../src/http/http';
import http from '../../../src/http/http';

interface User {
    email_md5: string;
    username: string;
    id: number | string;
    group: string;
    outbound: number;
    traffic: number;
    email: string;
}

interface RefreshTokenResponse {
    newToken: string;
}

export default function UserProfileCard() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [token, setToken] = useState<string>("");
    const [showToken, setShowToken] = useState(false);


    const handleTokenClick = () => {
        setShowToken(true);
    };

    // 在组件中添加状态用于控制提示框的显示与隐藏
    const [openTokenDialog, setOpenTokenDialog] = useState(false);

// 点击重置链接时触发的函数
    const handleResetTokenClick = () => {
        setOpenTokenDialog(true);
    };
// 用户确认重置密码
    const handleConfirmPasswordReset = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const {old_password, password} = event.currentTarget;

        if (!old_password.value || !password.value) {
            Message.error({content: "新/旧密码不能为空！", duration: 1000});
            return;
        }
        const formData = new FormData();
        formData.append('old_password', old_password.value.toString());
        formData.append('password', password.value.toString());

        try {
            const response = await http.post('/v4/auth/user/reset_password', formData);
            localStorage.removeItem("token");
            localStorage.setItem("token", response.data.token)
            Message.success({content: response.message, duration: 1000})
        } catch (error: any) {
            if (error.response) {
                Message.error({content: `更新失败，${error.response.data.message}`, duration: 1000})
            }
        }

    }
// 用户确认后执行重置操作的函数
    const handleConfirmReset = async () => {
        try {
            const response = await apiClient.post<RefreshTokenResponse>('/v4/auth/user/refresh_token');
            localStorage.removeItem("token");
            localStorage.setItem("token", response.data.newToken);
            window.location.reload();
        } catch (error: any) {
            if (error.response && error.response.data) {
                Message.error({content: "重置失败，" + error.response.data.message, duration: 1000});
            }
        }
        setOpenTokenDialog(false);
    };

// 取消重置操作的函数

    const handleCancelTokenReset = () => {
        setOpenTokenDialog(false);
    };

    const handleTokenCopy = () => {
        navigator.clipboard.writeText(token).then(() => {
            Message.success({content: "复制成功!", duration: 1000})
        }, (err) => {
            console.error('Async: Could not copy text: ', err);
        });
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const responseUser = await apiClient.get<User>('/v4/auth/user');
                setUser(responseUser.data);

                setToken(localStorage.getItem('token') || "");
            } catch (error: any) {
                setError(error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchData().then();
    }, []);

    if (error) {
        console.log(error);
        return (
            <Layout>
                <Container maxWidth="lg">
                    <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                        <CircularProgress/>
                    </Box>
                </Container>
            </Layout>
        );
    }

    if (isLoading || !user) {
        return (
            <Layout>
                <Container maxWidth="lg">
                    <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                        <CircularProgress/>
                    </Box>
                </Container>
            </Layout>
        );
    }

    const {email_md5, username, id, group, outbound, traffic, email} = user;
    return (
        <Layout>
            <Grid container spacing={2}>
                <Grid item xs={24}>
                    <Stack>
                        {group === 'default' ? (
                            <Alert severity="warning">
                                <AlertTitle>提示</AlertTitle>
                                您还未实名认证，将只能使用境外节点
                                实名认证后，您将可以使用境内节点 且 带宽限制将提升至 30Mbps
                            </Alert>

                        ) : (
                            <></>
                        )}</Stack>
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                    <Card style={{padding: '20px', height: "100%", marginBottom: '20px'}}>
                        <CardHeader
                            color="text.secondary"
                            avatar={<Avatar src={`https://dn-qiniu-avatar.qbox.me/avatar/${email_md5}`}/>}
                            title={username}
                        />
                        <CardContent>
                            <Typography sx={{mb: 1.5}} color="text.secondary">
                                用户名: {username}<br/>
                                用户 ID: {id}<br/>
                                用户组: {group}<br/>
                                出网带宽: {((outbound / 1024) * 8).toFixed(0)} Mbps<br/>
                                剩余流量: {(traffic / 1024).toFixed(0)} GB<br/>
                                邮箱: {email}<br/>
                                Token: {showToken ? (
                                <Tooltip title="已复制！" arrow>
                                            <span onClick={handleTokenCopy} style={{
                                                cursor: 'pointer',
                                                textDecoration: 'underline'
                                            }}>{token}</span>
                                </Tooltip>
                            ) : (
                                <Tooltip title="点击查看Token" arrow>
                                            <span onClick={handleTokenClick} style={{
                                                cursor: 'pointer',
                                                textDecoration: 'underline'
                                            }}>点击查看Token</span>
                                </Tooltip>
                            )}<br/>
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Dialog open={openTokenDialog} onClose={handleCancelTokenReset}>
                    <DialogTitle>确认重置 Token？</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            确认重置 Token 吗？这将使当前 Token 失效并生成新的 Token。
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCancelTokenReset} color="primary">
                            取消
                        </Button>
                        <Button onClick={handleConfirmReset} color="primary" autoFocus>
                            确定
                        </Button>
                    </DialogActions>
                </Dialog>
                <Grid item xs={12} md={6} lg={6}>
                    <Card style={{padding: '20px', height: "100%", marginBottom: '20px'}}>
                        <CardHeader
                            color="text.secondary"
                            title="修改用户信息"
                        />
                        <CardContent>
                            <Typography variant="h6">
                                更改密码
                            </Typography>
                            <Box mt={2}>
                                <Alert severity="warning">
                                    <AlertTitle>警告</AlertTitle>
                                    重置密码将会使当前 Token 失效并生成新的 Token。
                                </Alert>
                            </Box>
                            <Box component="form" onSubmit={handleConfirmPasswordReset} noValidate sx={{mt: 1}}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="old_password"
                                    label="旧密码"
                                    type="password"
                                    id="old_password"
                                    autoComplete="current-password"
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="新密码"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                />
                                <Button
                                    type="submit"
                                    name="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{mt: 3, mb: 2}}
                                >
                                    提交
                                </Button>
                            </Box>
                            <Typography variant="h6">
                                更换 Token
                            </Typography>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleResetTokenClick}
                            >
                                更换
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

        </Layout>
    );
}
