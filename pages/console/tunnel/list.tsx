import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Switch,
    TextField,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import Layout from '../../../src/components/Layout';
import Message from '../../../src/components/Message';
import apiClient from '../../../src/http/http';

type Tunnel = {
    easy_start: string;
    id: number;
    proxy_name: string;
    proxy_type: string;
    domain: string;
    node_hostname: string;
    remote_port: number;
    link?: string; // 将link作为可选属性
    node_name: string;
    local_port: number;
    local_ip: string;
    status: number;
    online: string;
    today_traffic_in: number;
    today_traffic_out: number;
    cur_conns: number;
    last_start_time : string;
    last_close_time : string;
}

export default function MyComponent() {
    const [open, setOpen] = useState(false);
    const [selectedTunnel, setSelectedTunnel] = useState<Tunnel | null>(null);
    const [tunnels, setTunnels] = useState<Tunnel[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [deleteTunnelID, setDeleteTunnelID] = useState<number | null>(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [TunnelLoaded, setTunnelLoaded] = useState(false);
    const [editFormData, setEditFormData] = useState({
        tunnelName: '',
        localPort: '',
        localIP: ''
    });

    useEffect(() => {
        fetchTunnels().then();
    }, []);

    const fetchTunnels = async () => {
        try {
            const response = await apiClient.get('/v4/auth/tunnel/list');
            const updatedTunnels = response.data.map((tunnel: Tunnel) => ({
                ...tunnel,
                link: tunnel.proxy_type === "http" || tunnel.proxy_type === "https"
                    ? `${tunnel.proxy_type}://${tunnel.domain}`
                    : `${tunnel.node_hostname}:${tunnel.remote_port}`
            }));
            setTunnels(updatedTunnels);
            setTunnelLoaded(true);
        } catch (error) {
            setError('Failed to fetch tunnels.');
        }
    };

    const handleClickOpen = (tunnel: Tunnel) => {
        setSelectedTunnel({
            ...tunnel,
            easy_start: `frpc -t ${localStorage.getItem("token")} -i ${tunnel.id}`
        });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // 点击删除按钮时触发的函数
    const handleDeleteTunnel = (id: number) => {
        setOpenDialog(true);
        setDeleteTunnelID(id); // 设置当前要删除的隧道ID
    };

    // 确认删除隧道
    const handleConfirmDelete = async (id: number | null) => {
        if (id === null) {
            return;
        }

        try {
            await apiClient.post(`/v4/auth/tunnel/delete/${id}`);
            setTunnels(tunnels.filter(tunnel => tunnel.id !== id)); // 从列表中移除已删除的隧道
        } catch (error) {
            setError('Failed to delete tunnel.');
        } finally {
            setOpenDialog(false);
        }
    };
    const handleDownTunnel = async (id: number | null) => {
        if (id === null) {
            return;
        }
        try {
            await apiClient.post(`/v4/auth/tunnel/close_tunnel/${id}`);
            Message.success({content: "隧道下线成功！", duration: 1000})
            // 更新隧道状态
            setTunnels(tunnels.map(t => {
                if (t.id === id) {
                    return {...t, status: t.status === 0 ? 1 : 0}; // 切换状态
                }
                return t;
            }));
        } catch (error: any) {
            Message.error({content: "隧道下线失败," + error.response.data.message, duration: 1000})
        }
    }

    const handleOpenEditDialog = (tunnel: Tunnel) => {
        setEditFormData({
            tunnelName: tunnel.proxy_name,
            localPort: tunnel.local_port.toString(),
            localIP: tunnel.local_ip
        });
        setSelectedTunnel(tunnel);
        setOpenEditDialog(true);
    };

    const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setEditFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleConfirmEdit = async () => {
        if (selectedTunnel) {
            try {
                // 构建 Form Data
                const formData = new FormData();
                formData.append('tunnel_id', selectedTunnel.id.toString());
                formData.append('tunnel_name', editFormData.tunnelName);
                formData.append('local_port', editFormData.localPort);
                formData.append('local_ip', editFormData.localIP);

                // 发送请求
                await apiClient.post(`/v4/auth/tunnel/edit_tunnel`, formData);
                Message.success({content: "隧道信息更新成功！", duration: 1000});
                await fetchTunnels(); // 重新获取隧道列表
                setOpenEditDialog(false); // 关闭编辑对话框
            } catch (error: any) {
                Message.error({content: "更新失败," + error.response.data.message, duration: 1000});
            }
        }
    };

    const toggleTunnelStatus = async (tunnel: Tunnel) => {
        try {
            // 构建 Form Data
            const formData = new FormData();
            formData.append('tunnel_id', tunnel.id.toString());
            formData.append('status', tunnel.status === 0 ? '1' : '0');
            // 发送请求
            const response = await apiClient.post(`/v4/auth/tunnel/edit_tunnel`, formData);
            Message.success({content: response.message, duration: 1000})

            // 更新隧道状态
            setTunnels(tunnels.map(t => {
                if (t.id === tunnel.id) {
                    return {...t, status: t.status === 0 ? 1 : 0}; // 切换状态
                }
                return t;
            }));
        } catch (error: any) {
            Message.error({content: "隧道状态切换失败," + error.response.data.message, duration: 1000})
        }
    }
    const handleCancelReset = () => {
        setOpenDialog(false);
    };

    if (error) {
        return (
            <Layout>
                <p>{error}</p>
            </Layout>
        );
    }

    // 如果隧道列表还未加载完成，则显示加载中的状态
    if (!TunnelLoaded) {
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
            <Container maxWidth="lg">
                {tunnels.length > 0 ? (
                    <Grid container spacing={3}>
                        {tunnels.map((tunnel) => (
                            <Grid item xs={12} sm={6} md={4} key={tunnel.id}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h5" component="div">
                                            {tunnel.proxy_name}
                                        </Typography>
                                        <Typography color="text.secondary">
                                            协议: {tunnel.proxy_type}
                                        </Typography>
                                        <Typography color="text.secondary">
                                            链接地址: {tunnel.link}
                                        </Typography>
                                        <Typography color="text.secondary">
                                            在线状态（存在延迟）: {tunnel.online == "online" ? '在线' : '离线'}
                                        </Typography>
                                        <Typography color="text.secondary">
                                            流量使用（入网/出网）: {(tunnel.today_traffic_in /1024/1024/1024).toFixed(2)} / {(tunnel.today_traffic_out /1024/1024/1024).toFixed(2)}GB
                                        </Typography>
                                    </CardContent>
                                    <CardActions style={{flexWrap: 'wrap', justifyContent: 'space-between'}}>
                                        <Switch
                                            checked={tunnel.status === 0}
                                            onChange={() => toggleTunnelStatus(tunnel)}
                                            inputProps={{'aria-label': '隧道状态开关'}}
                                        />
                                        <Button size="small" onClick={() => handleClickOpen(tunnel)}>详细信息</Button>
                                        <Button size="small" onClick={() => handleDeleteTunnel(tunnel.id)}>删除</Button>
                                        <Button size="small" onClick={() => handleOpenEditDialog(tunnel)}>修改</Button>
                                        <Button size="small"
                                                onClick={() => handleDownTunnel(tunnel.id)}>下线隧道</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                        <Typography variant="h4">您还没有创建隧道</Typography>
                    </Box>
                )}
            </Container>
            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                <DialogTitle>编辑隧道</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="normal"
                        id="tunnelName"
                        label="隧道名称"
                        type="text"
                        fullWidth
                        name="tunnelName"
                        value={editFormData.tunnelName}
                        onChange={handleEditFormChange}
                    />
                    <TextField
                        margin="normal"
                        id="localPort"
                        label="本地端口"
                        type="number"
                        fullWidth
                        name="localPort"
                        value={editFormData.localPort}
                        onChange={handleEditFormChange}
                    />
                    <TextField
                        margin="normal"
                        id="localIP"
                        label="本地IP"
                        type="text"
                        fullWidth
                        name="localIP"
                        value={editFormData.localIP}
                        onChange={handleEditFormChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)}>取消</Button>
                    <Button onClick={handleConfirmEdit}>保存</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openDialog} onClose={handleCancelReset}>
                <DialogTitle>确认删除隧道？</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        确认删除该隧道吗？这将使您不能继续使用该隧道并可能返回 API 404 错误。
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelReset} color="primary">
                        取消
                    </Button>
                    <Button onClick={() => handleConfirmDelete(deleteTunnelID)} color="primary" autoFocus>
                        确定
                    </Button>
                </DialogActions>
            </Dialog>
            {selectedTunnel && (
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>详细信息</DialogTitle>
                    <DialogContent>
                        <Typography>隧道名：{selectedTunnel.proxy_name}</Typography>
                        <Typography>协议：{selectedTunnel.proxy_type}</Typography>
                        {selectedTunnel.proxy_type === "http" || selectedTunnel.proxy_type === "https" ? (
                            <Typography>域名：{selectedTunnel.domain}</Typography>
                        ) : (
                            <Typography>远程端口：{selectedTunnel.remote_port}</Typography>
                        )}
                        <Typography>节点名：{selectedTunnel.node_name}</Typography>
                        <Typography>本地端口：{selectedTunnel.local_port}</Typography>
                        <Typography>本地IP：{selectedTunnel.local_ip}</Typography>
                        <Typography>节点主机名：{selectedTunnel.node_hostname}</Typography>
                        <Typography>简单启动命令: ./{selectedTunnel.easy_start}</Typography>
                        <Typography>当前连接数: {selectedTunnel.cur_conns}</Typography>
                        <Typography>今日流量使用（入网/出网）: {(selectedTunnel.today_traffic_in /1024/1024/1024).toFixed(2)} / {(selectedTunnel.today_traffic_out /1024/1024/1024).toFixed(2)}GB</Typography>
                        <Typography>上次启动时间: {selectedTunnel.last_start_time ? selectedTunnel.last_start_time : "从未启动"}</Typography>
                        <Typography>上次关闭时间: {selectedTunnel.last_close_time ? selectedTunnel.last_close_time : "从未关闭"}</Typography>

                        <Typography>Windows 用户请使用: .\{selectedTunnel.easy_start}</Typography>
                    </DialogContent>
                </Dialog>
            )}
        </Layout>
    );
}