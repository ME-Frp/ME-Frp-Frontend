import { Avatar, Card, CardContent, CardHeader, Container, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import apiClient from '../../src/http/http';

export default function UserProfileCard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await apiClient.get('/v2/user');
        setUser(response);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    }

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
      <Card sx={{ display: 'flex', flexDirection: 'column' }}>
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
          </Typography>
        </CardContent>
      </Card>
    </Layout>
  );
}