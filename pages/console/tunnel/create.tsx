import { Alert, AlertTitle, Box, Button, CircularProgress, Container, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import Layout from '../../../components/Layout';
import Message from '../../../components/Message';
import apiClient from '../../../src/http/http';

const TunnelCreationPage = () => {
  const [nodeList, setNodeList] = useState(null);
  const [selectedNode, setSelectedNode] = useState('');
  const [protocol, setProtocol] = useState('');
  const [localAddress, setLocalAddress] = useState('');
  const [localPort, setLocalPort] = useState('');
  const [remotePort, setRemotePort] = useState('');
  const [domain, setDomain] = useState('');
  const [proxyname, setProxyname] = useState('');
  const [allowPort, setAllowPort] = useState('');
  const [allowType, setAllowType] = useState('');
  const [realname, setRealname] = useState(null);
  const [nodeName, setNodeName] = useState('');
  const [status, setStatus] = useState('');

  const statusMap = {
    200: '正常',
    201: '无状态数据',
    500: '服务器异常',
  };

  useEffect(() => {
    // 请求节点列表
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
    fetchrealname();
    fetchNodeList();
  }, []);

  const handleNodeChange = (event) => {
    setSelectedNode(event.target.value);
    const selectedNodeData = nodeList.find((node) => node.id === event.target.value);
    setAllowPort(selectedNodeData.allow_port);
    setAllowType(selectedNodeData.allow_type);
    setNodeName(selectedNodeData.name);
    setProtocol('');
    // 根据 selectedNodeData.status 获取对应的状态文本
    const statusText = statusMap[selectedNodeData.Status];
    // 将状态文本存储到状态中
    setStatus(statusText);
    
  };

  const handleProtocolChange = (event) => {
    setProtocol(event.target.value);
  };

  const handleLocalAddressChange = (event) => {
    setLocalAddress(event.target.value);
  };

  const handleLocalPortChange = (event) => {
    setLocalPort(event.target.value);
  };

  const handleRemotePortChange = (event) => {
    setRemotePort(event.target.value);
  };

  const handleDomainChange = (event) => {
    setDomain(event.target.value);
  };

  const handleProxynameChange = (event) => {
    setProxyname(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // 使用 form-data 构建请求数据
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
      // 发送创建隧道请求
      const res = await apiClient.post('/v4/auth/tunnel/create', requestData);
      Message.success({ content: res.message , duration: 1000 });
      // 处理成功后的逻辑
    } catch (error) {
      if (error.response)
      console.error('Failed to create tunnel:', error.response.data.message);
      Message.error({ content: '隧道创建失败，' + error.response.data.message, duration: 1000 });
      // 处理失败后的逻辑
    }
  };
  if (!realname) {
    // handle loading state here
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
  // const isAuthenticated = 'default'
  const isAuthenticated = realname.view === 'default';
  return (
    <Layout>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
          {isAuthenticated ? (
            <Stack sx={{ width: '100%' }} spacing={2}>
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
              <FormControl fullWidth sx={{ mb: 2 }}>
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

              {allowPort && allowType && (
               <Stack sx={{ width: '100%' }} spacing={2}>
               <Alert severity="success">
               <AlertTitle># {selectedNode} - {nodeName} </AlertTitle>
               该节点允许的端口：{allowPort}<br />
               协议类型：{allowType}<br />
               实时节点状态：{status}
               </Alert>
               </Stack>
              )}
              <br />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>选择协议</InputLabel>
                  <Select 
                  label="选择协议"
                  value={protocol} 
                  onChange={handleProtocolChange}
                  >
              {allowType.includes('tcp') && (
                    <MenuItem value="tcp">TCP</MenuItem>
              )}

              {allowType.includes('udp') && (
                    <MenuItem value="udp">UDP</MenuItem>
              )}

              {allowType.includes('http') && (
                    <MenuItem value="http">HTTP</MenuItem>
              )}

              {allowType.includes('https') && (
                    <MenuItem value="https">HTTPS</MenuItem>
              )}
                </Select>
                </FormControl>
              <TextField
                label="隧道名称"
                value={proxyname}
                onChange={handleProxynameChange}
                fullWidth
                sx={{ mb: 2 }}
                helperText="来给你的隧道起一个名字吧！（支持英文/数字）"
              />

              <TextField
                label="本地地址"
                value={localAddress}
                onChange={handleLocalAddressChange}
                defaultValue="127.0.0.1"
                helperText="本地地址，一般是 127.0.0.1 。"
                fullWidth
                sx={{ mb: 2 }}
              />

              <TextField
                label="本地端口"
                value={localPort}
                onChange={handleLocalPortChange}
                fullWidth
                sx={{ mb: 2 }}
                helperText="本地服务所在的端口。"
              />

              {(protocol === 'tcp' || protocol === 'udp') && (
                <TextField
                  label="远程端口"
                  value={remotePort}
                  onChange={handleRemotePortChange}
                  fullWidth
                  helperText="您希望使用的 Frp 服务器的端口。"
                  sx={{ mb: 2 }}
                />
              )}

              {(protocol === 'http' || protocol === 'https') && (
                <TextField
                  label="域名"
                  value={domain}
                  onChange={handleDomainChange}
                  fullWidth
                  sx={{ mb: 2 }}
                  helperText="您自己的域名。"
                />
              )}

              <Button type="submit" variant="contained" fullWidth>
                创建隧道
              </Button>
            </form>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default TunnelCreationPage;