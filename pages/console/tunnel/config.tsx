/*
 * @Author: Aehxy ahmrcxy@gmail.com
 * @Date: 2023-09-28 12:36:20
 * @LastEditors: Aehxy ahmrcxy@gmail.com
 * @LastEditTime: 2023-10-15 15:16:03
 * @FilePath: \ME-Frp-Frontend\pages\console\tunnel\config.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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
        const response = await apiClient.get('/v4/auth/node/list');
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