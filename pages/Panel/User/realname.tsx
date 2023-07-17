import { Button, Grid, Paper, TextField, Typography } from '@mui/material';
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
  
      try {
        const formData = new FormData();
        formData.append('idcard', idcard);
        formData.append('name', name);
  
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
        return <div>Loading...</div>;
      }
      // 判断status.view是否为realname，如果是则给isAuthenticated赋值true，否则赋值false
      const isAuthenticated = status.view === 'realname';

  return (
    <Layout>
    <Paper sx={{ padding: '1rem', maxWidth: '400px', margin: '0 auto' }}>
      {isAuthenticated ? (
        <Grid>
          <Typography variant="h6">您已实名认证</Typography>
          <Typography variant="body1">实名认证时间：{new Date(status.time).toLocaleString()}</Typography>
          </Grid>
      ) : (
        <Grid>
          <Typography variant="h6">未实名认证</Typography>
          <TextField label="身份证号码" fullWidth />
          <TextField label="姓名" fullWidth />
          <Button variant="contained" onClick={handleRealnamePost}>提交</Button>
          </Grid>
      )}
    </Paper>
    </Layout>
  );
};