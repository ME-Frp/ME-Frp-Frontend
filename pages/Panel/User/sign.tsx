import { Button, Paper, Typography } from '@mui/material';
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
        const response = await apiclient.get('/v2/sign');
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
      const response = await apiclient.post('/v2/sign');
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
    return <div>Loading...</div>;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const lastSignInTime = signInfo.signdate;
  const canSignIn = currentTime - lastSignInTime >= 24 * 60 * 60;

  return (
    <Layout>
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
    </Layout>
  );
}

export default SignInPage;