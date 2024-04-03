import {
    Alert,
    AlertTitle,
    Box,
    Card,
    CardContent,
    CardHeader,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    Typography
} from '@mui/material';
import apiClient from '@src/http/http';
import { useEffect, useState } from 'react';

interface Node {
    id: string;
    name: string;
}

const ConfigPage = () => {
    // 使用Node[]定义nodeList的类型，初始化为空数组
    const [nodeList, setNodeList] = useState<Node[]>([]);
    const [selectedNode, setSelectedNode] = useState('');
    // configData现在是string类型
    const [configData, setConfigData] = useState<string>('');

    useEffect(() => {
        const fetchNodeList = async () => {
            try {
                const response = await apiClient.get('/v4/auth/node/list');
                // 确保response.data是Node[]类型
                setNodeList(response.data as Node[]);
            } catch (error) {
                console.error('Failed to fetch node list:', error);
            }
        };

        fetchNodeList().then();
    }, []);

    const handleNodeChange = async (event: SelectChangeEvent) => {
        const selectedNodeId = event.target.value as string;
        setSelectedNode(selectedNodeId);

        if (selectedNodeId) {
            try {
                const response = await apiClient.get(`/v4/auth/tunnel/conf/node/${selectedNodeId}`);
                setConfigData(response as string);
            } catch (error) {
                console.error('Failed to fetch config:', error);
            }
        } else {
            setConfigData('');
        }
    };

    return (
            <Grid container spacing={2} alignItems="stretch">
                <Grid item xs={12} md={6}>
                    <Card elevation={3} sx={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">
                                选择节点
                            </Typography>
                            <FormControl fullWidth sx={{mb: 2}}>
                                <InputLabel>选择节点</InputLabel>
                                <Select value={selectedNode} onChange={handleNodeChange}>
                                    {nodeList.map((node) => (
                                        <MenuItem key={node.id} value={node.id}>{node.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {configData && (
                                <Paper elevation={1} sx={{p: 2}}>
                                    <Typography variant="body2" component="pre" sx={{overflow: 'auto'}}>
                                        {configData}
                                    </Typography>
                                </Paper>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card elevation={3} sx={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                        <CardHeader
                            color="text.secondary"
                            title="提示"
                        />
                        <CardContent sx={{flexGrow: 1}}>
                            <Box mt={2}>
                                <Alert severity="warning">
                                    <AlertTitle>警告</AlertTitle>
                                    如果您是<strong> 萌新/小白</strong> 请使用<strong>简单启动</strong> 方法，或者是使用图形化客户端<br/>
                                    配置文件启动仅限于高级用户使用，请在完全了解 Frpc 配置文件的情况下使用。<br/>
                                    使用配置文件启动所产生的一切用户自身问题将一概不会得到解答。
                                </Alert>
                            </Box>
                            <Box mt={2}>
                                <Typography variant="h5">1.如何获取真实 IP？</Typography>
                                首先，请在 Frpc 配置文件的中所需获取真实 IP 隧道配置中（即非[common]块）的最下部加入<br/>
                                <strong>proxy_protocol_version = v2</strong><br/>
                                然后，请在您的应用中接受 Proxy_Protocol 传递的 IP<br/>
                                <Typography variant="h6">例如 Nginx</Typography>
                                修改为<br/>
                                listen 80 proxy_protocol;<br/>
                                listen 443 ssl http2 proxy_protocol;<br/>
                                安装 ngx_http_realip_module 模块，并加入。<br/>
                                real_ip_header proxy_protocol;<br/>
                                real_ip_recursive on;<br/>
                                set_real_ip_from 127.0.0.1;<br/>
                                <Typography variant="h6">Minecraft</Typography>
                                BungeeCord / Waterfall / Paper 请开启 proxy_protocol<br/>
                                Velocity 开启 haproxy-protocol <br/>
                                Spigot 及衍生可以尝试添加一层 BungeeCodrd / Waterfall / Velocity 代理或添加
                                HAProxyDetector 插件
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
    );
};

export default ConfigPage;