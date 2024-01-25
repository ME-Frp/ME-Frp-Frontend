import { NoSsr } from '@mui/base';
import { Box, Button, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useEffect, useState } from 'react';
import Layout from '../../../components/Layout';
import apiClient from '../../../src/http/http';

type Tunnel = {
  id: number;
  proxy_name: string;
  proxy_type: string;
  domain: string;
  node_hostname: string;
  remote_port: number;
  link: string;
  node_name: string;
  local_port: number;
  local_ip: string;
}

export default function MyComponent() {
  const [open, setOpen] = useState(false);
  const [selectedTunnelId, setSelectedTunnelId] = useState<number | null>(null);
  const [tunnels, setTunnels] = useState(null);
  const [error, setError] = useState<Error | null>(null);
  const [info, setInfo] = useState(null);
  const [easy_start, setEasy_start] = useState(null);
  const [OpenDialog, setOpenDialog] = useState(false);
  const [DeleteTunnelID, setDeleteTunnelID] = useState<number | null>(null);

  useEffect(() => {
    fetchTunnels();
  }, []);

  const fetchTunnels = async () => {
    try {
      const response = await apiClient.get('/v4/auth/tunnel/list');
      setTunnels(response.data);
    } catch (error) {
      setError(error);
    }
  }

  const handleClickOpen = async (id: number) => {
    setSelectedTunnelId(id);
    try {
      setEasy_start("frpc -t " + localStorage.getItem("token") + " -i " + id)
      const response = await apiClient.get('/v4/auth/tunnel/info/' + id);
      setInfo(response.data);
    } catch (error) {
      console.log(error);
    }
    setOpen(true);
  }

  // 生成链接地址
  useEffect(() => {
    if (tunnels) {
      setTunnels(prevTunnels => {
        return prevTunnels.map(tunnel => {
          // 如果 type 是 http / https 则为 http(s)://+domain
          // 如果 type 是 tcp/udp 则为 tunnel.node_hostname:tunnel.remote_port
          tunnel.link = tunnel.proxy_type === "http" || tunnel.proxy_type === "https"
            ? `${tunnel.proxy_type}://${tunnel.domain}`
            : `${tunnel.node_hostname}:${tunnel.remote_port}`
          return tunnel;
        });
      });
    }
  }, [tunnels]);

  const handleClose = () => {
    setOpen(false);
  };

  // 点击删除按钮时触发的函数
const handleDeleteTunnel = async (id: number) => {
  setOpenDialog(true); // 打开提示框
  setDeleteTunnelID(id);
};

  const handleConfirmDelete = async (id: number) => {
    try {
      const response = await apiClient.post('/v4/auth/tunnel/delete/' + id);
      console.log(response.data);
      fetchTunnels();
    } catch (error) {
      console.log(error);
    }
  }

  if (error) {
    return (
      <Layout>
        <p>Error</p>
      </Layout>
    );
  }
if (!tunnels) {
  return (
    <Layout>
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    </Container>
  </Layout>)
}
  function handleCancelReset(event: {}): void {
    setOpenDialog(false);
  }

  return (
    <Layout>
      <Paper>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>隧道名</TableCell>
              <TableCell>协议</TableCell>
              <TableCell>链接地址</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <NoSsr>
            <TableBody>
              {tunnels ? tunnels.map((tunnel) => (
                <TableRow key={tunnel.id}>
                  <TableCell>{tunnel.proxy_name}</TableCell>
                  <TableCell>{tunnel.proxy_type}</TableCell>
                  <TableCell>{tunnel.link}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleClickOpen(tunnel.id)}
                    >
                      详细信息
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleDeleteTunnel(tunnel.id)}
                    >
                      删除
                    </Button>
                  </TableCell>
                </TableRow>
              )) : <p>Loading…</p>}
            </TableBody>
          </NoSsr>
        </Table>
      </Paper>
      <Dialog open={OpenDialog} onClose={handleCancelReset}>
      <DialogTitle>确认删除隧道？</DialogTitle>
      <DialogContent>
        <DialogContentText>
          确认删除该隧道吗？这将使您不能继续使用该隧道并返回 API 404 错误。
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancelReset} color="primary">
          取消
        </Button>
        <Button onClick={() =>handleConfirmDelete(DeleteTunnelID)} color="primary" autoFocus>
          确定
        </Button>
      </DialogActions>
    </Dialog>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>详细信息</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <div>
              {info ? (
                <>
                  <p>隧道名：{info.proxy_name}</p>
                  <p>协议：{info.proxy_type}</p>
                  <p>域名：{info.domain}</p>
                  <p>节点名：{info.node_name}</p>
                  <p>本地端口：{info.local_port}</p>
                  <p>本地IP：{info.local_ip}</p>
                  <p>远程端口：{info.remote_port}</p>
                  <p>节点主机名：{info.node_hostname}</p>
                  <p>简单启动命令:  ./{easy_start}</p>
                  <p>Windows 用户请使用: .\{easy_start}</p>
                </>
              ) : null}
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}