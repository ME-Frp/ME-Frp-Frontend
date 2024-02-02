import { Alert, AlertTitle, Avatar, Box, Button, Card, CardContent, CardHeader, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Stack, Tooltip, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Message from '../../components/Message';
import apiClient from '../../src/http/http';

interface User {
    email_md5: string;
    username: string;
    id: number | string;
    group: string;
    outbound: number;
    traffic: number;
    email: string;
}

interface Setting {
    ads: {
        ad1: {
            title: string;
            content: string;
        };
    };
    alert: {
        [key: string]: {
            title: string;
            content: string;
        };
    };
    announce: {
        [key: string]: {
            title: string;
            content: string;
        };
    };
}

interface RefreshTokenResponse {
    newToken: string;
}

export default function UserProfileCard() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [token, setToken] = useState<string>("");
    const [setting, setSetting] = useState<Setting | null>(null);
    const [showToken, setShowToken] = useState(false);


    const handleTokenClick = () => {
        setShowToken(true);
    };

    // 在组件中添加状态用于控制提示框的显示与隐藏
    const [openDialog, setOpenDialog] = useState(false);

// 点击重置链接时触发的函数
    const handleResetTokenClick = () => {
        setOpenDialog(true);
    };

// 用户确认后执行重置操作的函数
    const handleConfirmReset = async () => {
        try {
            const response = await apiClient.post<RefreshTokenResponse>('/v4/auth/user/refresh_token');
            localStorage.removeItem("token");
            localStorage.setItem("token", response.data.newToken);
            window.location.reload();
        } catch (error: any) {
            if (error.response && error.response.data) {
                Message.error({ content: "重置失败，" + error.response.data.message , duration: 1000 });
            }
        }
        setOpenDialog(false);
    };

// 取消重置操作的函数

    const handleCancelReset = () => {
        setOpenDialog(false);
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
                const responseSetting = await apiClient.get<Setting>('/v4/public/info/setting');
                setUser(responseUser.data);
                setSetting(responseSetting.data);

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
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                        <CircularProgress />
                    </Box>
                </Container>
            </Layout>
        );
    }

    if (isLoading || !user || !setting) {
        return (
            <Layout>
                <Container maxWidth="lg">
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                        <CircularProgress />
                    </Box>
                </Container>
            </Layout>
        );
    }

    const { email_md5, username, id, group, outbound, traffic, email } = user;
    return (
        <Layout>
            <Grid container spacing={2}>
                <Grid item xs={24}>
                    <Stack >
                        {Object.keys(setting.alert).map((key) => {
                            if (setting.alert[key]?.title !== "null") {
                                const severity = key === 'success' ? 'success' : key === 'info' ? 'info' : key === 'warning' ? 'warning' : 'error';
                                return (
                                    <Alert key={key} severity={severity}>
                                        <AlertTitle>{setting.alert[key].title}</AlertTitle>
                                        {setting.alert[key].content}
                                    </Alert>
                                );
                            }
                            return null;
                        })}
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
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Card style={{ padding: '20px', height: "100%", marginBottom: '20px' }}>
                                <CardHeader
                                    color="text.secondary"
                                    avatar={<Avatar src={`https://dn-qiniu-avatar.qbox.me/avatar/${email_md5}`} />}
                                    title={username}
                                />
                                <CardContent>
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        用户名: {username}<br />
                                        用户 ID: {id}<br />
                                        用户组: {group}<br />
                                        出网带宽: {((outbound / 1024) * 8).toFixed(0)} Mbps<br />
                                        剩余流量: {(traffic / 1024).toFixed(0)} GB<br />
                                        邮箱: {email}<br />
                                        token: {showToken ? (
                                        <Tooltip title="已复制！" arrow>
                                            <span onClick={handleTokenCopy} style={{ cursor: 'pointer', textDecoration: 'underline' }}>{token}</span>
                                        </Tooltip>
                                    ) : (
                                        <Tooltip title="点击查看Token" arrow>
                                            <span onClick={handleTokenClick} style={{ cursor: 'pointer', textDecoration: 'underline' }}>点击查看Token</span>
                                        </Tooltip>
                                    )}<br />
                                    </Typography>
                                    <span onClick={handleResetTokenClick} style={{ cursor: 'pointer', textDecoration: 'underline' }}>Token 已经泄露？点我一键重置 Token</span>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Dialog open={openDialog} onClose={handleCancelReset}>
                            <DialogTitle>确认重置 Token？</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    确认重置 Token 吗？这将使当前 Token 失效并生成新的 Token。
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCancelReset} color="primary">
                                    取消
                                </Button>
                                <Button onClick={handleConfirmReset} color="primary" autoFocus>
                                    确定
                                </Button>
                            </DialogActions>
                        </Dialog>
                        <Grid item xs={12}>
                            <Card style={{ padding: '20px' }}>
                                <CardHeader
                                    color="text.secondary"
                                    title={setting.ads.ad1.title}
                                    />
                                <CardContent>
                                  {setting.ads.ad1.content}
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                    <Card style={{ padding: '20px', height: "100%", marginBottom: '20px' }}>
                        <CardHeader
                            color="text.secondary"
                            title="公告"
                        />
                        <CardContent>
                            {Object.keys(setting.announce).map((key) => {
                                if (setting.announce[key]?.title !== "null") {
                                    return (
                                        <Grid>
                                            <Typography variant="h6">
                                                {setting.announce[key].title}
                                            </Typography>
                                            <Typography>
                                                {setting.announce[key].content}
                                            </Typography>
                                        </Grid>
                                    );
                                }
                                return null;
                            })}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

        </Layout>
    );
}
