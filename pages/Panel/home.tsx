import { Container, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import apiClient from '../../src/http/http';
export default function MyComponent() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiClient
      .get('/users')
      .then((response) => {
        setData(response);
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

  if (!data) {
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
    <Container maxWidth="lg">
      <Typography>用户名: {JSON.stringify(data.name)}</Typography>
    </Container>
    </Layout>
  );
 }