import CircularProgress from '@components/CircularProgress';
import Message from '@components/Message';
import {
    Alert,
    AlertTitle,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
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
import { default as apiClient, default as http } from '@src/http/http';
import Image from 'next/image';
import * as React from 'react';
import { useEffect, useState } from 'react';

interface User {
    email_md5: string;
    username: string;
    id: number | string;
    group: string;
    outbound: number;
    traffic: number;
    email: string;
}

interface RealnameStatus {
    time: number;
    code: number;
    realname: string;
    view: string;
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
    const [status, setStatus] = useState<RealnameStatus>();


    const handleRealnamePost = async (event: React.FormEvent<HTMLFormElement>) => {
        // Replace `idcardValue` and `nameValue` with the actual field values entered by the user
        event.preventDefault();
        const {realname, idcard} = event.currentTarget;

        if (!realname.value) {
            Message.error({content: "姓名不能为空", duration: 1000});
            return;
        }
        if (!idcard.value) {
            Message.error({content: "身份证号码不能为空", duration: 1000});
            return;
        }

        try {
            const formData = new FormData();
            formData.append('idcard', idcard.value.toString());
            formData.append('name', realname.value.toString());

            const response = await apiClient.post('/v4/auth/user/realname/post', formData);
            Message.success({content: "实名认证成功，" + response.data.message, duration: 1000});
            // 刷新页面
            window.location.reload();
        } catch (error: any) {
            if (error.response) {
                Message.error({content: "实名认证失败，" + error.response.data.message, duration: 1000});
            } else {
                Message.error({content: "实名认证失败，" + error, duration: 1000});
            }
        }
    };

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
                const response = await apiClient.get<RealnameStatus>('/v4/auth/user/realname/get');
                setStatus(response.data);
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
                <Container maxWidth="lg">
                    <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                        <CircularProgress/>
                    </Box>
                </Container>
        );
    }

    if (isLoading || !user || !status) {
        return (
                <Container maxWidth="lg">
                    <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                        <CircularProgress/>
                    </Box>
                </Container>
        );
    }
    const isAuthenticated = status.view === 'realname';
    const {email_md5, username, id, group, outbound, traffic, email} = user;
    return (
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
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
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
                        <Grid item xs={12}>
                            <Card style={{padding: '20px', height: "100%", marginBottom: '20px'}}>
                                <CardHeader
                                    color="text.secondary"
                                    title="实名认证"
                                />
                                <CardContent>
                                    {isAuthenticated ? (
                                        <Grid>
                                            <Typography variant="h6">您已实名认证</Typography>
                                            <Typography
                                                variant="body1">实名认证时间：{new Date(status.time * 1000).toLocaleString()}</Typography>
                                        </Grid>
                                    ) : (
                                        <Box onSubmit={handleRealnamePost} component="form">
                                            <Typography variant="h6">您还未实名认证</Typography>
                                            <TextField
                                                id="realname"
                                                label="姓名"
                                                margin="normal"
                                                required
                                                fullWidth
                                            />
                                            <TextField
                                                id="idcard"
                                                label="身份证号码"
                                                fullWidth
                                                margin="normal"
                                                required
                                            />
                                            <Typography variant='body1'>
                                                点击提交即代表您同意了我们的《实名认证诚信收费及未成年人实名认证政策》
                                            </Typography>
                                            <Button fullWidth variant="contained" type="submit">提交</Button>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
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
                <Grid item xs={24}>
                    <Card style={{padding: '20px', height: "100%", marginBottom: '20px'}}>
                        <CardHeader
                            color="text.secondary"
                            title="《实名认证诚信收费及未成年人实名认证政策》"
                        />
                        <Typography variant='h6'>
                            此项没有硬性要求，您可以<strong>付费</strong>，也可以选择<strong>不付费</strong>，亦或是选择<strong>实名/不实名</strong>一切取决于您。<br/>
                        </Typography>
                        <Typography variant='body1'>
                            我们提供的是完全免费的服务，在 Frp 业务上我们没有任何的盈利，成本开销不断增大，但我们只为了给您提供一个<strong>免费、好用的内网穿透服务</strong>。<br/>
                            以此我们的实名认证决定收取 一次 0.5 元的认证费用（不强求，若确实没有能力可以不付款或少付），但是我们采用<strong>实名认证诚信收费政策</strong>，内容如下：<br/>
                            如果您<strong>有能力付款</strong>，请以帮助我们走的更远的心态使用下方二维码给我们付款，我们将不胜感激。<br/>
                            如果您<strong>确实没有能力付款</strong>, 您便可选择不付款，我们理解您的苦衷。<br/>
                            但如果您是未成年人，并满怀热情想使用我们的服务，请确保您争取了您监护人的同意。<strong>如果您未争取监护人同意，则出现的一切问题我们将不负任何责任</strong><br/>
                            以下是运营团队想给您说的几句话↓<br/>
                            我们的运营团队中也有部分学生身份存在，我们深知学生使用部分服务时候的种种不便利，例如
                            云服务商实名认证18+ 、部分提供商的实名认证需要付款，但自己没有经济能力亦或是没有支付平台账号（当然这也可能正是您选择我们的原因）
                            出于您对我们的信赖，我们推出了该政策，即：<br/>
                            1.确实没有能力，实名认证可以不收费。<br/>
                            2.未成年人可以在家长同意的前提下进行实名认证<br/>
                        </Typography>
                        <Box display="flex" alignItems="center" marginBottom="10px">
                            <Grid item>
                                <Image src="/assets/alipay_qiye.png" alt="支付宝" width={250} height={375}/>
                            </Grid>
                            <Grid>
                                <Image src="/assets/wechat_qiye.png" alt="微信支付" width={250} height={375}/>
                            </Grid>
                        </Box>
                    </Card>
                </Grid>
            </Grid>
    );
}
