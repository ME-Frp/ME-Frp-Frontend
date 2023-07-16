import { Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import Layout from '../../../components/Layout';
import Message from '../../../components/Message';
import apiClient from '../../../src/http/http';
// 替换为你的API客户端

const TunnelCreationPage = () => {
  const [nodeList, setNodeList] = useState(null);
  const [selectedNode, setSelectedNode] = useState('');
  const [protocol, setProtocol] = useState('');
  const [localAddress, setLocalAddress] = useState('');
  const [localPort, setLocalPort] = useState('');
  const [remotePort, setRemotePort] = useState('');
  const [domain, setDomain] = useState('');
    const [proxyname, setProxyname] = useState('');

  useEffect(() => {
    // 请求节点列表
    const fetchNodeList = async () => {
      try {
        const response = await apiClient.get('/v2/node/list');
        setNodeList(response.data);
      } catch (error) {
        console.error('Failed to fetch node list:', error);
      }
    };

    fetchNodeList();
  }, []);

  const handleNodeChange = (event) => {
    setSelectedNode(event.target.value);
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
    if (protocol === "http" || protocol === "https") {
        requestData.append('domain', domain);
    } else if (protocol === "tcp" || protocol === "udp") {
    requestData.append('remote_port', remotePort);
    }
    requestData.append('proxy_name', proxyname);


    try {
      // 发送创建隧道请求
      await apiClient.post('/v2/tunnel/create', requestData);
      console.log('Tunnel created successfully!');
      Message.success({content: '隧道创建成功！', duration: 1000});
      // 处理成功后的逻辑
    } catch (error) {
      console.error('Failed to create tunnel:', error.response.data.error);
      Message.error({content: '隧道创建失败！' + error.response.data.error, duration: 1000});
      // 处理失败后的逻辑
    }
  };

  return (
    <Layout>
    <Grid container justifyContent="center">
      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>选择节点</InputLabel>
              <Select value={selectedNode} onChange={handleNodeChange}>
          {nodeList ? nodeList.map((node) => (
            <MenuItem key={node.id} value={node.id}>{node.name}</MenuItem>
            )): <p>Loading…</p>}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>选择协议</InputLabel>
              <Select value={protocol} onChange={handleProtocolChange}>
                <MenuItem value="tcp">TCP</MenuItem>
                <MenuItem value="udp">UDP</MenuItem>
                <MenuItem value="http">HTTP</MenuItem>
                <MenuItem value="https">HTTPS</MenuItem>
              </Select>
            </FormControl>

            <TextField
                label="隧道名称"
                value={proxyname}
                onChange={handleProxynameChange}
                fullWidth
                sx={{ mb: 2 }}
                />

            <TextField
              label="本地地址"
              value={localAddress}
              onChange={handleLocalAddressChange}
              fullWidth
              sx={{ mb: 2 }}
            />

            <TextField
              label="本地端口"
              value={localPort}
              onChange={handleLocalPortChange}
              fullWidth
              sx={{ mb: 2 }}
            />

            {(protocol === 'tcp' || protocol === 'udp') && (
              <TextField
                label="远程端口"
                value={remotePort}
                onChange={handleRemotePortChange}
                fullWidth
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
              />
            )}

            <Button type="submit" variant="contained" fullWidth>
              创建隧道
            </Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
    </Layout>
  );
};

export default TunnelCreationPage;