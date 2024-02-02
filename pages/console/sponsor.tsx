import {
    Box,
    Button,
    ButtonGroup,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import {useEffect, useState} from 'react';
import Image from 'next/image';
import Layout from '../../src/components/Layout';
import apiClient from '../../src/http/http';

type Sponsor = {
    id: number;
    email: string;
    name: string;
    thing: string;
    comment: string;
};

interface Setting {
    ads: {
        ad4: {
            title: string;
            content: string;
        };
    };
}

const SponsorPage = () => {
    const [sponsors, setSponsors] = useState<Sponsor[] | null>(null);
    const [setting, setSetting] = useState<Setting | null>(null);

    useEffect(() => {
        const fetchSponsors = async () => {
            try {
                const response = await apiClient.get('/v4/public/info/sponsor');
                const responseSetting = await apiClient.get<Setting>('/v4/public/info/setting');
                setSetting(responseSetting.data);
                setSponsors(response.data);
            } catch (error) {
                console.error('Error fetching sponsors:', error);
            }
        };

        fetchSponsors().then();
    }, []);
    if (!sponsors || !setting) {
        // handle loading state here
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
    return (
        <Layout>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Card elevation={3} style={{padding: '20px', height: '100%', marginBottom: '20px'}}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                赞助我们
                            </Typography>
                            <Grid container alignItems="center" marginBottom="10px">
                                <Grid item xs={12} sm={6}>
                                    <Image src="/assets/alipay.jpg" alt="支付宝" width={250} height={375}/>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Image src="/assets/wechat.jpg" alt="微信支付" width={250} height={375}/>
                                </Grid>
                            </Grid>
                            <Typography variant="body1" gutterBottom>你的支持是我们最大的动力！</Typography>
                            <Typography variant="body1" gutterBottom>不要忘记备注您的用户名、邮箱和留言哦！</Typography>
                            <ButtonGroup variant="contained" aria-label="outlined primary button group">
                                <Button href="https://afdian.net/a/aehxy" variant="contained">爱发电</Button>
                                <Button href="https://qm.qq.com/q/Ob3I1Gu52y"
                                        variant="contained">QQ(节点赞助/合作需求)</Button>
                            </ButtonGroup>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card elevation={3} style={{padding: '20px', height: '100%', marginBottom: '20px'}}>
                        <CardContent>
                            <Typography variant="h5" component="div">{setting.ads.ad4.title}</Typography>
                            <br/>
                            <Typography variant="body1">{setting.ads.ad4.content}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={24}>
                    <Card elevation={3} style={{padding: '20px', marginBottom: '20px'}}>
                        <Typography variant="h5" gutterBottom>
                            赞助者列表
                        </Typography>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>姓名</TableCell>
                                        <TableCell>邮箱</TableCell>
                                        <TableCell>赞助事项</TableCell>
                                        <TableCell>留言</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {sponsors ? sponsors.map((sponsor) => (
                                        <TableRow key={sponsor.id}>
                                            <TableCell>{sponsor.name}</TableCell>
                                            <TableCell>{sponsor.email}</TableCell>
                                            <TableCell>{sponsor.thing}</TableCell>
                                            <TableCell>{sponsor.comment}</TableCell>
                                        </TableRow>
                                    )) : null}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Card>
                </Grid>
            </Grid>
        </Layout>
    );
};

export default SponsorPage;