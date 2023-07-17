import { Button, Grid, Paper, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Layout from '../../../components/Layout';
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
  
    const handleRealnamePost = async () => {
      // Replace `idcardValue` and `nameValue` with the actual field values entered by the user
      const idcardValue = ''; // Retrieve the value entered in the ID card input field
      const nameValue = ''; // Retrieve the value entered in the name input field
  
      try {
        const formData = new FormData();
        formData.append('idcard', idcardValue);
        formData.append('name', nameValue);
  
        const response = await apiClient.post('/v2/realname/post', formData);
        console.log('Response:', response.data);
      } catch (error) {
        console.error('Error:', error);
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