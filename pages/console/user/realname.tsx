import { Box, Button, Container, Grid, Paper, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Layout from '../../../components/Layout';
import Message from '../../../components/Message';
import apiClient from '../../../src/http/http';

export default function RealnamePage()  {
    const [time, setTime] = useState('');
    const [status, setStatus] = useState(null);
  
    useEffect(() => {
      const getRealnameInfo = async () => {
        try {
          const response = await apiClient.get('/v2/realname/get');
          setStatus(response);
        } catch (error) {
          console.error('Error:', error);
        }
      };
  
      getRealnameInfo();
    }, []);
  
    const handleRealnamePost = async (event) => {
      // Replace `idcardValue` and `nameValue` with the actual field values entered by the user
      event.preventDefault();
      const { name, idcard } = event.currentTarget;

      if (!name.value) {
        Message.error({ content: "姓名不能为空", duration: 1000 });
        return;
      }
      if (!idcard.value) {
        Message.error({ content: "身份证号码不能为空", duration: 1000 });
        return;
      }
  
      try {
        const formData = new FormData();
        formData.append('idcard', idcard.value.toString());
        formData.append('name', name.value.toString());
  
        const response = await apiClient.post('/v2/realname/post', formData);
        Message.success({ content: "实名认证成功，自动刷新页面…", duration: 1000 });
        // 刷新页面
        window.location.reload();
      } catch (error) {
       if (error.response) {
        Message.error({ content: "实名认证失败，" + error.response.data.message, duration: 1000 });
       } else {
        Message.error({ content: "实名认证失败，" + error, duration: 1000 });
       }
      }
    };
    if (!status) {
    // handle loading state here
    return (
      <Layout>
        <Container maxWidth="lg">
          <Typography>Loading…</Typography>
        </Container>
      </Layout>
    );
      }
      // 判断status.view是否为realname，如果是则给isAuthenticated赋值true，否则赋值false
      const isAuthenticated = status.view === 'realname';

  return (
    <Layout>
    <Paper sx={{ padding: '1rem', maxWidth: '400px', margin: '0 auto' }}>
      {isAuthenticated ? (
        <Grid>
          <Typography variant="h6">您已实名认证</Typography>
          <Typography variant="body1">实名认证时间：{new Date(status.time * 1000).toLocaleString()}</Typography>
          </Grid>
      ) : (
        <Box onSubmit={handleRealnamePost} component="form">
          <Typography variant="h6">未实名认证</Typography>
          <TextField id="name" label="姓名" fullWidth />
          <TextField id="idcard" label="身份证号码" fullWidth />
          <Button variant="contained" type="submit">提交</Button>
          </Box>
      )}
    </Paper>
    </Layout>
  );
};