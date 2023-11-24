import { Alert, AlertTitle, Avatar, Box, Card, CardContent, CardHeader, Container, Grid, Link, Paper, Stack, Tooltip, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import apiClient from '../../src/http/http';

export default function UserProfileCard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);

  const [showToken, setShowToken] = useState(false);

  const handleTokenClick = () => {
  setShowToken(true);
  };

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
        setUser(response);
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
    return (
      <Layout>
        <Container maxWidth="lg">
          <Typography>Error</Typography>
        </Container>
      </Layout>
    );
  }

  if (isLoading || !user) {
    // handle loading state here
    return (
      <Layout>
        <Container maxWidth="lg">
          <Typography>Loading…</Typography>
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
            avatar={<Avatar src={`https://dn-qiniu-avatar.qbox.me/avatar/?email=${email_md5}`} />}
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
              )}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant="h5" component="h1" gutterBottom>
            广告
          </Typography>
          <Typography variant="body1" gutterBottom>
            樱雨云 香港 CN2 GIA 2H2G 仅需要 24 元每月 测试 IP: <Link href="https://www.itdog.cn/ping/107.151.250.1"> 107.151.250.1</Link>  <Link href="https://cloud.aqinco.cn/cart?action=configureproduct&pid=139"> 立即购买</Link> <br />
            美国 AS9929 高防云服务器 仅需 47.88 元每月 <Link href="https://console.cloud.aqinco.com/cart?action=configureproduct&pid=14"> 立即购买</Link> <br />
            更多国内外云服务器 物理机 等，请访问 <Link href="https://console.cloud.aqinco.com"> 樱雨云</Link> <br />
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
        {group === 'admin' ? (
          <Stack sx={{ width: '100%' }} spacing={2}>
            <Alert severity="info">
              <AlertTitle>提示</AlertTitle>
              您还未实名认证，将只能使用境外节点
              实名认证后，您将可以使用境内节点 且 带宽限制将提升至 30Mbps
            </Alert>
          </Stack>
        ) : (
          <></>
        )}<Box mt={2}>
          <Typography>
          我们的服务完全免费，但是我们需要您的支持，如果您愿意，可以到左侧的 赞助我们 页面来支持我们
          如果您拥有服务器资源，可以联系我们进行节点赞助。也可以进行资金支持，谢谢大家。<br />
          官方 QQ 群: 772054227<br />
        </Typography>
        </Box>
      </CardContent>
    </Card>
  </Grid>
</Grid>
    </Layout>
  );
}