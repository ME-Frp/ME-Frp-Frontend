import {
    Alert,
    AlertColor,
    AlertTitle,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    CircularProgress,
    Container,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    TextField
} from '@mui/material';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import Message from '../../../src/components/Message';
import { default as apiClient, default as http } from '../../../src/http/http';

interface Node {
    id: string;
    name: string;
    description: string;
    allow_port: string;
    allow_type: string;
    status: number;
}

interface FreePortData {
    free_port: string
}

interface RealnameResponse {
    view: string;
}

function generateRandomString(length: number) {
    // 定义所有可能的字符
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const TunnelCreationPage = () => {
    const [nodeList, setNodeList] = useState<Node[]>([]);
    const [selectedNode, setSelectedNode] = useState<string>('');
    const [protocol, setProtocol] = useState<string>('');
    const [localAddress, setLocalAddress] = useState<string>('127.0.0.1');
    const [localPort, setLocalPort] = useState<string>('');
    const [remotePort, setRemotePort] = useState<string>('');
    const [domain, setDomain] = useState<string>('');
    const [proxyname, setProxyname] = useState<string>(generateRandomString(6));
    const [Node, setNode] = useState<Node>();
    const [realname, setRealname] = useState<RealnameResponse | null>(null);
    const [status, setStatus] = useState<string>('');
    const [severity, setSeverity] = useState<AlertColor | undefined>(undefined);

    const statusMap: { [key: number]: string } = {
        200: '正常',
        201: '无状态数据',
        500: '服务器异常',
    };

    const severities: { [key: number]: AlertColor } = {
        200: 'success',
        201: 'info',
        500: 'warning',
    };

    useEffect(() => {
        const fetchNodeList = async () => {
            try {
                const response = await apiClient.get('/v4/auth/node/list');
                setNodeList(response.data);
            } catch (error) {
                console.error('Failed to fetch node list:', error);
            }
        };
        const fetchrealname = async () => {
            try {
                const response = await apiClient.get('/v4/auth/user/realname/get');
                setRealname(response.data);
            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchrealname().then();
        fetchNodeList().then();
    }, []);
    const handleNodeChange = (event: SelectChangeEvent) => {
        const value = event.target.value as string;
        setSelectedNode(value);
        const selectedNodeData = nodeList.find((node) => node.id === value);
        if (selectedNodeData) {
            setNode(selectedNodeData)
            setProtocol('');
            setStatus(statusMap[selectedNodeData.status]);
            setSeverity(severities[selectedNodeData.status]);
        }
    };

    const handleProtocolChange = async (event: SelectChangeEvent) => {
        setProtocol(event.target.value as string);
        let protocol: string = event.target.value
        if (protocol === 'tcp' || protocol === 'udp') {
            try {
                const response = await http.get<FreePortData>('/v4/auth/tunnel/get_free_port?node=' + selectedNode + '&protocol=' + event.target.value as string)
                setRemotePort(response.data.free_port)
            } catch (error: any) {
                Message.error({content: '获取空闲端口失败，' + error.response.data.message, duration: 1000});
            }
        }
    };

    const handleLocalAddressChange = (event: ChangeEvent<HTMLInputElement>) => {
        setLocalAddress(event.target.value);
    };

    const handleLocalPortChange = (event: ChangeEvent<HTMLInputElement>) => {
        setLocalPort(event.target.value);
    };

    const handleRemotePortChange = (event: ChangeEvent<HTMLInputElement>) => {
        setRemotePort(event.target.value);
    };

    const handleDomainChange = (event: ChangeEvent<HTMLInputElement>) => {
        setDomain(event.target.value);
    };

    const handleProxynameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setProxyname(event.target.value);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const requestData = new FormData();
        requestData.append('node', selectedNode);
        requestData.append('proxy_type', protocol);
        requestData.append('local_ip', localAddress);
        requestData.append('local_port', localPort);
        if (protocol === 'http' || protocol === 'https') {
            requestData.append('domain', domain);
        } else if (protocol === 'tcp' || protocol === 'udp') {
            requestData.append('remote_port', remotePort);
        }
        requestData.append('proxy_name', proxyname);

        try {
            const res = await apiClient.post('/v4/auth/tunnel/create', requestData);
            // 刷新
            window.location.reload();
            Message.success({content: res.message, duration: 1000});
        } catch (error: any) {
            if (error.response)
                console.error('Failed to create tunnel:', error.response.data.message);
            Message.error({content: '隧道创建失败，' + error.response.data.message, duration: 1000});
        }
    };

    if (!realname) {
        return (
                <Container maxWidth="lg">
                    <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                        <CircularProgress/>
                    </Box>
                </Container>
        );
    }

    const isAuthenticated = realname.view === 'default';

    return (
            <Grid container justifyContent="center">
                <Grid item xs={12}>
                    {/* 使用Card组件替换Paper组件 */}
                    <Card sx={{p: 3, mt: 2}}>
                        <CardHeader
                            color="text.secondary"
                            title="创建隧道"
                        />
                        <CardContent>
                            {isAuthenticated ? (
                                <Stack sx={{width: '100%'}} spacing={2}>
                                    <Alert severity="info">
                                        <AlertTitle>提示</AlertTitle>
                                        您还未实名认证，将只能使用境外节点
                                        实名认证后，您将可以使用境内节点 且 带宽限制将提升至 30Mbps
                                    </Alert>
                                </Stack>
                            ) : (
                                <></>
                            )}
                            <Box mt={2}>
                                <form onSubmit={handleSubmit}>
                                    <FormControl fullWidth sx={{mb: 2}}>
                                        <InputLabel>选择节点</InputLabel>
                                        <Select
                                            label="选择节点"
                                            value={selectedNode}
                                            onChange={handleNodeChange}
                                        >
                                            {nodeList ? (
                                                nodeList.map((node) => (
                                                    <MenuItem key={node.id} value={node.id}>
                                                        {node.name}
                                                    </MenuItem>
                                                ))
                                            ) : (
                                                <p>Loading…</p>
                                            )}
                                        </Select>
                                    </FormControl>

                                    {Node?.allow_type && Node?.allow_type && (
                                        <Stack sx={{width: '100%'}} spacing={2}>
                                            <Alert severity={severity}>
                                                <AlertTitle># {selectedNode} - {Node?.name} </AlertTitle>
                                                节点描述: {Node?.description}<br/>
                                                该节点允许的端口：{Node?.allow_port.replace(/;/g, ' ')}<br/>
                                                协议类型：{Node?.allow_type.replace(/;/g, ' ')}<br/>
                                                实时节点状态：{status}
                                            </Alert>
                                        </Stack>
                                    )}
                                    <br/>
                                    <FormControl fullWidth sx={{mb: 2}}>
                                        <InputLabel>选择协议</InputLabel>
                                        <Select
                                            label="选择协议"
                                            value={protocol}
                                            onChange={handleProtocolChange}
                                        >
                                            {Node?.allow_type.includes('tcp') && (
                                                <MenuItem value="tcp">TCP</MenuItem>
                                            )}

                                            {Node?.allow_type.includes('udp') && (
                                                <MenuItem value="udp">UDP</MenuItem>
                                            )}

                                            {Node?.allow_type.includes('http') && (
                                                <MenuItem value="http">HTTP</MenuItem>
                                            )}

                                            {Node?.allow_type.includes('https') && (
                                                <MenuItem value="https">HTTPS</MenuItem>
                                            )}
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        label="隧道名称"
                                        value={proxyname}
                                        onChange={handleProxynameChange}
                                        fullWidth
                                        sx={{mb: 2}}
                                        helperText="来给你的隧道起一个名字吧！（支持英文/数字）"
                                    />

                                    <TextField
                                        label="本地地址"
                                        value={localAddress}
                                        onChange={handleLocalAddressChange}
                                        helperText="本地地址，一般是 127.0.0.1 。"
                                        fullWidth
                                        sx={{mb: 2}}
                                    />

                                    <TextField
                                        label="本地端口"
                                        value={localPort}
                                        onChange={handleLocalPortChange}
                                        fullWidth
                                        sx={{mb: 2}}
                                        helperText="本地服务所在的端口。"
                                    />

                                    {(protocol === 'tcp' || protocol === 'udp') && (
                                        <TextField
                                            label="远程端口"
                                            value={remotePort}
                                            onChange={handleRemotePortChange}
                                            fullWidth
                                            helperText="您希望使用的 Frp 服务器的端口。"
                                            sx={{mb: 2}}
                                        />
                                    )}

                                    {(protocol === 'http' || protocol === 'https') && (
                                        <TextField
                                            label="域名"
                                            value={domain}
                                            onChange={handleDomainChange}
                                            fullWidth
                                            sx={{mb: 2}}
                                            helperText="您自己的域名。"
                                        />
                                    )}

                                    <Button type="submit" variant="contained" fullWidth>
                                        创建隧道
                                    </Button>
                                </form>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
    );
};

export default TunnelCreationPage;