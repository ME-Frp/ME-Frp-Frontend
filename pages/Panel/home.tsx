import { Avatar, Button, Card, CardActions, CardContent, CardHeader, Container, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import apiClient from '../../src/http/http';
export default function MyComponent() {
  const [user, setUser] = useState(null);
  const [traffic, setTraffic] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiClient
      .get('/users')
      .then((response) => {
        setUser(response);
      })
      .catch((error) => {
        setError(error);
      });
    apiClient
      .get('/modules/frp/traffic')
      .then((response) => {
        setTraffic(response);
      })
      .catch((error) => {
        setError(error);
      });
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
// 如果用户或traffic不存在 则显示加载中
  if (!user || !traffic) {
    // handle loading state here
    return (
      <Layout>
    <Container maxWidth="lg">
      <Typography>Loading…</Typography>
    </Container>
    </Layout>
  );
  }

  // use data here
  return (
    <Layout>
    <Card sx={{ display: 'flex', flexDirection: 'column' }}>
      <CardHeader 
      color="text.secondary"
      avatar={
        <Avatar src={"https://dn-qiniu-avatar.qbox.me/avatar/?email=" + JSON.parse(JSON.stringify(user.email_md5)) } />
      }
      title={JSON.parse(JSON.stringify(user.name))}
      />
      <CardContent>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
        用户名: {JSON.parse(JSON.stringify(user.name))}<br />
        用户 ID : {JSON.parse(JSON.stringify(user.id))}<br />
        用户组: {JSON.parse(JSON.stringify(user.user_group.name))}<br />
        剩余流量: {JSON.parse(JSON.stringify(traffic.free_traffic))} GB<br />
        邮箱: {JSON.parse(JSON.stringify(user.email))}<br />
        账户余额: {JSON.parse(JSON.stringify(user.balance))} 元<br />

        </Typography>
      </CardContent>
      <CardActions>
        <Button href={"https://api.laecloud.com/balances"}>充值余额</Button>
        <Button href={"https://api.laecloud.com/transactions"}>交易记录</Button>
      </CardActions>
    </Card>
    </Layout>
  );
 }