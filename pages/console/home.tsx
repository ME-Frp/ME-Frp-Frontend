import { Avatar, Box, Card, CardContent, CardHeader, Container, Link, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import apiClient from '../../src/http/http';

export default function UserProfileCard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);

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
                        <Box display="flex">
            <Box flex={1} mr={1} style={{ height: "100%" }}>
      <Card  style={{ padding: '20px', height: "100%", marginBottom: '20px' }}>
        <CardHeader
          color="text.secondary"
          avatar={<Avatar src={`https://dn-qiniu-avatar.qbox.me/avatar/?email=${email_md5}`} />}
          title={username}
        />
        <CardContent>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            用户名: {username}<br />
            用户 ID : {id}<br />
            用户组: {group}<br />
            出网带宽: {(outbound / 1024) * 8}Mbps<br />
            剩余流量: {traffic / 1024} GB<br />
            邮箱: {email}<br />
            token: {token}<br />
          </Typography>
        </CardContent>
      </Card>
      </Box>
      <Box flex={1} ml={1} style={{ height: "100%" }}>
      <Card style={{ padding: '20px', height: "100%", marginBottom: '20px' }}>
        <CardHeader
          color="text.secondary"
          title="公告"
        />
        <CardContent>
          <Typography color="text.secondary">
              如果您还未实名认证，将只能使用境外节点
              实名认证后，您将可以使用境内节点 且 带宽限制将提升至 30Mbps <br />
              我们的服务完全免费，但是我们需要您的支持，如果您愿意，可以到左侧的 赞助我们 页面来支持我们
              如果您拥有服务器资源，可以联系我们进行节点赞助。也可以进行资金支持，谢谢大家。<br />
              官方 QQ 群: 772054227<br />
            </Typography>
        </CardContent>
      </Card>
      </Box>
      </Box>
      <Box flex={1} mr={1} style={{ height: "100%" }}>
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
      </Box>
    </Layout>
  );
}