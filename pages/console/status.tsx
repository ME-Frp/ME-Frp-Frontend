import { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Container,
    Box,
    CircularProgress,
    Card, CardContent, Grid,
} from '@mui/material';
import http from '../../src/http/http';
import Layout from "../../src/components/Layout";
import Typography from "@mui/material/Typography";

interface ServerData {
    id: number;
    name: string;
    version: string;
    total_traffic_in: number;
    total_traffic_out: number;
    online_count: number;
    status: number;
}

const ServerStatusPage = () => {
    const [servers, setServers] = useState<ServerData[]>([]);
    const [isLoading, setIsLoading] = useState(true); // 新增状态变量来跟踪加载状态

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true); // 开始请求前设置为true
                const response = await http.get('/v4/auth/node/list/all');
                console.log(response.status);
                if (response.status === 200) {
                    const filteredData = response.data.map((server: any) => ({
                        id: server.id,
                        name: server.name,
                        version: server.status !== 200 ? '无数据' : server.version,
                        total_traffic_in: server.status !== 200 ? 0 : server.total_traffic_in,
                        total_traffic_out: server.status !== 200 ? 0 : server.total_traffic_out,
                        online_count: server.status !== 200 ? 0 : server.online_count,
                        status: server.status
                    }));
                    setServers(filteredData);
                }
            } catch (error) {
                console.error('There was an error fetching the server data:', error);
            } finally {
                setIsLoading(false); // 请求完成后设置为false
            }
        };
        fetchData();
    }, []);

    if (isLoading) { // 使用isLoading来决定是否显示加载指示器
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
    // 计算总入网、总出网和在线隧道数
    const totalTrafficIn = servers.reduce((acc, server) => acc + server.total_traffic_in, 0);
    const totalTrafficOut = servers.reduce((acc, server) => acc + server.total_traffic_out, 0);
    const totalTunnels = servers.reduce((acc, server) => acc + server.online_count, 0); // 根据online_count累加

    return (
        <Layout>
            <Grid container spacing={3}> {/* 使用 Grid 容器 */}
                <Grid item xs={12}> {/* Card 占据全部宽度 */}
                    <Card sx={{ mb: 4 }}>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                总览
                            </Typography>
                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                总入网: {(totalTrafficIn/ 1024 / 1024 / 1024).toFixed(2)} GB
                            </Typography>
                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                总出网: {(totalTrafficOut/ 1024 / 1024 / 1024).toFixed(2)} GB
                            </Typography>
                            <Typography color="text.secondary">
                                在线隧道数: {totalTunnels}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12}> {/* Table 也占据全部宽度 */}
        <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>名称</TableCell>
                        <TableCell>版本</TableCell>
                        <TableCell>总入网</TableCell>
                        <TableCell>总出网</TableCell>
                        <TableCell>在线隧道数</TableCell>
                        <TableCell>状态</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {servers.length > 0 ? (
                        servers.map((server) => (
                            <TableRow key={server.id}>
                                <TableCell>#{server.id}</TableCell>
                                <TableCell>{server.name}</TableCell>
                                <TableCell>{server.version}</TableCell>
                                <TableCell>{(server.total_traffic_in / 1024 / 1024 / 1024).toFixed(2) } GB</TableCell>
                                <TableCell>{(server.total_traffic_out / 1024 / 1024 / 1024).toFixed(2)} GB</TableCell>
                                <TableCell>{server.online_count}</TableCell>
                                <TableCell>{server.status === 200 ? '正常' : '异常'}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7}>No data</TableCell>
                        </TableRow>
                    )
                }
                </TableBody>
            </Table>
        </TableContainer>
    </Grid>
</Grid>
        </Layout>
    );
};

export default ServerStatusPage;