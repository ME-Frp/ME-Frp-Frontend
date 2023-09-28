import { FormControl, Grid, InputLabel, MenuItem, Paper, Select, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Layout from '../../../components/Layout';
import apiClient from '../../../src/http/http';


const ConfigPage = () => {
  const [nodeList, setNodeList] = useState(null);
  const [selectedNode, setSelectedNode] = useState('');
  const [configData, setConfigData] = useState(null);

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

  const handleNodeChange = async (event) => {
    const selectedNodeId = event.target.value;
    setSelectedNode(selectedNodeId);

    if (selectedNodeId) {
      try {
        // 发送获取配置文件请求
        const response = await apiClient.get(`/v2/tunnel/conf/node/${selectedNodeId}`);
        setConfigData(response);
      } catch (error) {
        console.error('Failed to fetch config:', error);
      }
    } else {
      setConfigData('');
    }
  };

  return (
    <Layout>
    <Grid container justifyContent="center">
      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>选择节点</InputLabel>
            <Select value={selectedNode} onChange={handleNodeChange}>
              {nodeList ? nodeList.map((node) => (
                <MenuItem key={node.id} value={node.id}>{node.name}</MenuItem>
              )) : <p>Loading…</p>}
            </Select>
          </FormControl>

          {configData && (
            <Paper elevation={1} sx={{ p: 2 }}>
              <Typography variant="body2">
                <pre>
                  {configData}
                  </pre>
                  </Typography>
            </Paper>
          )}
        </Paper>
      </Grid>
    </Grid>
    </Layout>
  );
};

export default ConfigPage;