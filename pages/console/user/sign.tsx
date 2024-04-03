import {
    Alert,
    AlertTitle,
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
    Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Message from '../../../src/components/Message';
import apiClient from '../../../src/http/http';

interface SignInfo {
    id: string;
    username: string;
    totalsign: number;
    totaltraffic: string;
    signdate: number;
}

interface Setting {
    ads: {
        ad2: {
            title: string;
            content: string;
        };
        ad3: {
            title: string;
            content: string;
        };
    };
}


function SignPage() {
    const [signInfo, setSignInfo] = useState<SignInfo | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [setting, setSetting] = useState<Setting | null>(null);
    const [traffic, setTraffic] = useState<string | null>(null);

    const handleConfirmReset = () => {
        setOpenDialog(false);
        // 刷新
        window.location.reload();
    };

    // 获取签到信息
    useEffect(() => {
        async function fetchSignInfo() {
            try {
                const response = await apiClient.get<SignInfo>('/v4/auth/user/sign');
                const responseSetting = await apiClient.get<Setting>('/v4/public/info/setting');
                setSignInfo(response.data);
                setSetting(responseSetting.data);
            } catch (error: any) {
                console.log(error);
            }
        }

        fetchSignInfo().then();
    }, []);

    // 签到按钮点击处理函数
    async function handleSign() {
        try {
            const response = await apiClient.post<SignInfo>('/v4/auth/user/sign');
            setSignInfo(response.data);
            setTraffic(response.data.traffic);
            setOpenDialog(true);
        } catch (error: any) {
            if (error.response && error.response.data) {
                Message.error({content: "签到失败，" + error.response.data.message, duration: 1000});
            }
        }
    }

    if (!signInfo || !setting) {
        // handle loading state here
        return (
                <Container maxWidth="lg">
                    <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                        <CircularProgress/>
                    </Box>
                </Container>
        );
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const lastSignTime = signInfo.signdate;
    const canSign = currentTime - lastSignTime >= 24 * 60 * 60;

    return (
        <Grid>
            <Container maxWidth="lg">
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6} lg={6}>
                        <Card style={{padding: '20px', height: '100%', marginBottom: '20px'}}>
                            <CardHeader
                                color="text.secondary"
                                title="签到"
                            />
                            <CardContent>
                            <Typography>总签到次数: {signInfo.totalsign}</Typography>
                            <Typography>总获得流量: {signInfo.totaltraffic}</Typography>
                            <Box mt={2}>
                                <Button variant="contained" onClick={handleSign} disabled={!canSign}>
                                    签到
                                </Button>
                            </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                        <Card style={{padding: '20px', height: '100%', marginBottom: '20px'}}>
                            <Stack>
                                <Box mt={2}>
                                    <Alert severity="info">
                                        <AlertTitle>提示</AlertTitle>
                                        通过签到，您每天可以免费获得 1-10 GB 的流量。
                                    </Alert>
                                </Box>
                                <Box mt={2}>
                                    <Alert severity="warning">
                                        <AlertTitle>警告</AlertTitle>
                                        严禁使用任何爬虫工具进行自动签到等行为，发现者立即封禁。
                                    </Alert>
                                </Box>
                            </Stack>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card style={{padding: '20px', height: '100%', marginBottom: '20px'}}>
                            <Typography variant="h6">{setting.ads.ad2.title}</Typography>
                            <Markdown remarkPlugins={[remarkGfm]}>{setting.ads.ad2.content}</Markdown>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card style={{padding: '20px', height: '100%', marginBottom: '20px'}}>
                            <Typography variant="h6">{setting.ads.ad3.title}</Typography>
                            <Typography>{setting.ads.ad3.content}</Typography>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
            <Dialog open={openDialog} onClose={handleConfirmReset}>
                <DialogTitle>签到成功！</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        签到成功，获得了 {traffic} GB 流量。
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmReset} color="primary" autoFocus>
                        确定
                    </Button>
                </DialogActions>
            </Dialog>
            </Grid>
    );

}

export default SignPage;