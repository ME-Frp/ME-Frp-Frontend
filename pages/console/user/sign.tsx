/*
 * @Author: Aehxy ahmrcxy@gmail.com
 * @Date: 2023-09-28 12:36:20
 * @LastEditors: Aehxy ahmrcxy@gmail.com
 * @LastEditTime: 2023-10-15 15:02:57
 * @FilePath: \ME-Frp-Frontend\pages\console\user\sign.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Box, Button, CircularProgress, Container, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Layout from '../../../components/Layout';
import apiclient from '../../../src/http/http';
// 替换成你的 API 客户端库

function SignInPage() {
  const [signInfo, setSignInfo] = useState(null);
  const [signInError, setSignInError] = useState(null);

  // 获取签到信息
  useEffect(() => {
    async function fetchSignInfo() {
      try {
        const response = await apiclient.get('/v4/auth/user/sign');
        setSignInfo(response.data);
      } catch (error) {
        // 处理错误
        // console.log(error);
      }
    }

    fetchSignInfo();
  }, []);

  // 签到按钮点击处理函数
  async function handleSign() {
    try {
      const response = await apiclient.post('/v4/auth/user/sign');
      // 处理成功签到的响应数据
      // console.log(response.data);
      setSignInfo(response.data);
      setSignInError(null);
      // 刷新
      window.location.reload();
    } catch (error) {
      if (error.response && error.response.data) {
        // 处理签到失败的响应数据
        // console.log(error.response.data);
        setSignInError(error.response.data.message);
      } else {
        // 处理其他错误
        // console.log(error);
      }
    }
  }

  if (!signInfo) {
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

  const currentTime = Math.floor(Date.now() / 1000);
  const lastSignInTime = signInfo.signdate;
  const canSignIn = currentTime - lastSignInTime >= 24 * 60 * 60;

  return (
    <Layout>
                  <Box display="flex">
            <Box flex={1} mr={1}>
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h6">签到</Typography>
      <Typography>ID: {signInfo.id}</Typography>
      <Typography>用户名: {signInfo.username}</Typography>
      <Typography>总签到次数: {signInfo.totalsign}</Typography>
      <Typography>总流量: {signInfo.totaltraffic}</Typography>

      {canSignIn ? (
        <Button variant="contained" onClick={handleSign}>
          签到
        </Button>
      ) : (
        <Typography>每24小时只能签到一次</Typography>
      )}

      {signInError && <Typography>{signInError}</Typography>}
    </Paper>
    </Box>
    <Box flex={1} ml={1}>
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h6">广告</Typography>
      <Typography>广告位招租</Typography>
    </Paper>
    </Box>
    </Box>
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h6">广告</Typography>
      <Typography>广告位招租</Typography>
    </Paper>
    </Layout>
  );
}

export default SignInPage;