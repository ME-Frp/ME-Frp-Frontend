import { Button, Dialog, DialogContent, DialogContentText, DialogTitle, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useEffect, useState } from 'react';
import Layout from '../../../components/Layout';
import NoSSR from '../../../components/NoSSR';
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

  useEffect(() => {
    fetchTunnels();
  }, []);

  const fetchTunnels = async () => {
    try {
      const response = await apiClient.get('/v2/tunnel/list');
      setTunnels(response);
    } catch (error) {
      setError(error);
    }
  }

  const handleClickOpen = async (id: number) => {
    setSelectedTunnelId(id);
    try {
      const response = await apiClient.get('/v2/tunnel/info/' + id);
      setInfo(response);
          // 设定 easy_start 
    setEasy_start("./frpc -t " + localStorage.getItem("token") + " -i " + info.id)
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

  const handleDeleteTunnel = async (id: number) => {
    try {
      const response = await apiClient.post('/v2/tunnel/delete/' + id);
      console.log(response);
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
          <NoSSR>
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
          </NoSSR>
        </Table>
      </Paper>
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
                  <p>简单启动命令: {easy_start}</p>
                </>
              ) : null}
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}