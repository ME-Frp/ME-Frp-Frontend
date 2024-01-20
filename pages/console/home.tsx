import { Alert, AlertTitle, Avatar, Box, Button, Card, CardContent, CardHeader, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Paper, Stack, Tooltip, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Message from '../../components/Message';
import apiClient from '../../src/http/http';

export default function UserProfileCard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [setting, setSetting] = useState(null);
  const [refresh, setRefresh] = useState(null);
  const [showToken, setShowToken] = useState(false);


  const handleTokenClick = () => {
    setShowToken(true);
  };

  // 在组件中添加状态用于控制提示框的显示与隐藏
const [openDialog, setOpenDialog] = useState(false);

// 点击重置链接时触发的函数
const handleResetTokenClick = () => {
  setOpenDialog(true); // 打开提示框
};

// 用户确认后执行重置操作的函数
const handleConfirmReset = () => {
  // 在这里执行重置操作
  handleRefresh();
  setOpenDialog(false); // 关闭提示框
};
async function handleRefresh() {
  try {
    const response = await apiClient.post('/v4/auth/user/refresh_token');
    // 处理成功签到的响应数据
    // console.log(response.data);
    setRefresh(response.data);
    // 重写
    localStorage.removeItem("token");
    localStorage.setItem("token", response.data.newToken)
    // 刷新
    window.location.reload();
  } catch (error) {
    if (error.response && error.response.data) {
      Message.error({ content: "重置失败，" + error.response.data.message , duration: 1000 })
    } else {
      // 处理其他错误
      // console.log(error);
    }
  }
}

// 取消重置操作的函数
function handleCancelReset(event: {}): void {
  setOpenDialog(false);
}

  const handleTokenCopy = () => {
    const el = document.createElement('textarea');
    el.value = token;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await apiClient.get('/v4/auth/user');
        const set = await apiClient.get('/v4/public/info/setting');
        setUser(response.data);
        setSetting(set.data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    }
    // 获取 localStorage 中的 token 
    setToken(localStorage.getItem('token'));
    fetchData();
  }, []);


  if (error) {
    // handle error here
    console.log(error);
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

  if (isLoading || !user) {
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

  const { email_md5, username, id, group, outbound, traffic, email } = user;
  return (
    <Layout>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={6}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card style={{ padding: '20px', height: "100%", marginBottom: '20px' }}>
                <CardHeader
                  color="text.secondary"
                  avatar={<Avatar src={`https://dn-qiniu-avatar.qbox.me/avatar/${email_md5}`} />}
                  title={username}
                />
                <CardContent>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    用户名: {username}<br />
                    用户 ID: {id}<br />
                    用户组: {group}<br />
                    出网带宽: {((outbound / 1024) * 8).toFixed(0)} Mbps<br />
                    剩余流量: {(traffic / 1024).toFixed(0)} GB<br />
                    邮箱: {email}<br />
                    token: {showToken ? (
                      <Tooltip title="已复制！" arrow>
                        <span onClick={handleTokenCopy} style={{ cursor: 'pointer', textDecoration: 'underline' }}>{token}</span>
                      </Tooltip>
                    ) : (
                      <Tooltip title="点击查看Token" arrow>
                        <span onClick={handleTokenClick} style={{ cursor: 'pointer', textDecoration: 'underline' }}>点击查看Token</span>
                      </Tooltip>
                    )}<br />
                  </Typography>
                  <span onClick={handleResetTokenClick} style={{ cursor: 'pointer', textDecoration: 'underline' }}>Token 已经泄露？点我一键重置 Token</span>
                </CardContent>
              </Card>
            </Grid>
            <Dialog open={openDialog} onClose={handleCancelReset}>
      <DialogTitle>确认重置 Token？</DialogTitle>
      <DialogContent>
        <DialogContentText>
          确认重置 Token 吗？这将使当前 Token 失效并生成新的 Token。
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancelReset} color="primary">
          取消
        </Button>
        <Button onClick={handleConfirmReset} color="primary" autoFocus>
          确定
        </Button>
      </DialogActions>
    </Dialog>
            <Grid item xs={12}>
              <Paper elevation={3} style={{ padding: '20px' }}>
                <Typography variant="h5" component="h1" gutterBottom>
                  {setting.ads.ad1.title}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {setting.ads.ad1.content}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <Card style={{ padding: '20px', height: "100%", marginBottom: '20px' }}>
            <CardHeader
              color="text.secondary"
              title="公告"
            />
            <CardContent>
            <Stack sx={{ width: '100%' }} spacing={2}>
                  {Object.keys(setting.alert).map((key) => {
                    if (setting.alert[key]?.title !== "null") {
                      const severity = key === 'success' ? 'success' : key === 'info' ? 'info' : key === 'warning' ? 'warning' : 'error';
                      return (
                        <Alert key={key} severity={severity}>
                          <AlertTitle>{setting.alert[key].title}</AlertTitle>
                          {setting.alert[key].content}
                        </Alert>
                      );
                    }
                    return null;
                  })}
        {group === 'default' ? (
            <Alert severity="info">
              <AlertTitle>提示</AlertTitle>
              您还未实名认证，将只能使用境外节点
              实名认证后，您将可以使用境内节点 且 带宽限制将提升至 30Mbps
            </Alert>
          
        ) : (
          <></>
        )}</Stack>
              <Box mt={2}>
                <Typography>
                  {setting.announce[0].content}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}
