import { Box, Button, Card, CardHeader, CircularProgress, Container, Grid, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Layout from '../../../components/Layout';
import Message from '../../../components/Message';
import Image from 'next/image';
import apiClient from '../../../src/http/http';

export default function RealnamePage()  {
    const [time, setTime] = useState('');
    const [status, setStatus] = useState(null);
  
    useEffect(() => {
      const getRealnameInfo = async () => {
        try {
          const response = await apiClient.get('/v4/auth/user/realname/get');
          setStatus(response.data);
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
  
        const response = await apiClient.post('/v4/auth/user/realname/post', formData);
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
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    </Layout>
    );
      }
      // 判断status.view是否为realname，如果是则给isAuthenticated赋值true，否则赋值false
      const isAuthenticated = status.view === 'realname';

  return (
    <Layout>
       <Box display="flex">
            <Box flex={1} ml={1} style={{ height: "100%" }}>
      <Card style={{ padding: '20px', height: "100%", marginBottom: '20px' }}>
        <CardHeader
          color="text.secondary"
          title="实名认证"
        />
      {isAuthenticated ? (
        <Grid>
          <Typography variant="h6">您已实名认证</Typography>
          <Typography variant="body1">实名认证时间：{new Date(status.time * 1000).toLocaleString()}</Typography>
          </Grid>
      ) : (
        <Box onSubmit={handleRealnamePost} component="form">
          <Typography variant="h6">您还未实名认证</Typography>
          <TextField id="name" label="姓名" fullWidth />
          <TextField id="idcard" label="身份证号码" fullWidth />
          <Typography variant='body1'>
            点击提交即代表您同意了我们的《实名认证诚信收费及未成年人实名认证政策》
          </Typography>
          <Button variant="contained" type="submit">提交</Button>
          </Box>
      )}
      </Card>
      </Box>
      <Box flex={1} ml={1} style={{ height: "100%" }}>
      <Card style={{ padding: '20px', height: "100%", marginBottom: '20px' }}>
        <CardHeader
          color="text.secondary"
          title="《实名认证诚信收费及未成年人实名认证政策》"
        />
      <Typography variant='h6'>
        此项没有硬性要求，您可以<strong>付费</strong>，也可以选择<strong>不付费</strong>，亦或是选择<strong>实名/不实名</strong>一切取决于您。<br /> 
      </Typography>
      <Typography variant='body1'>
        我们提供的是完全免费的服务，在 Frp 业务上我们没有任何的盈利，成本开销不断增大，但我们只为了给您提供一个<strong>免费、好用的内网穿透服务</strong>。<br />
        以此我们的实名认证决定收取 一次 0.5 元的认证费用（不强求，若确实没有能力可以不付款或少付），但是我们采用<strong>实名认证诚信收费政策</strong>，内容如下：<br /> 
        如果您<strong>有能力付款</strong>，请以帮助我们走的更远的心态使用下方二维码给我们付款，我们将不胜感激。<br />
        如果您<strong>确实没有能力付款</strong>, 您便可选择不付款，我们理解您的苦衷。<br />
        但如果您是未成年人，并满怀热情想使用我们的服务，请确保您争取了您监护人的同意。<strong>如果您未争取监护人同意，则出现的一切问题我们将不负任何责任</strong><br />
        以下是运营团队想给您说的几句话↓<br />
        我们的运营团队中也有部分学生身份存在，我们深知学生使用部分服务时候的种种不便利，例如 云服务商实名认证18+ 、部分提供商的实名认证需要付款，但自己没有经济能力亦或是没有支付平台账号（当然这也可能正是您选择我们的原因）
        出于您对我们的信赖，我们推出了该政策，即：<br />
        1.确实没有能力，实名认证可以不收费。<br />
        2.未成年人可以在家长同意的前提下进行实名认证<br />
      </Typography>
      <Box display="flex" alignItems="center" marginBottom="10px">
        <Image src="/assets/alipay.jpg" alt="支付宝" width={250} height={375} />
        <Image src="/assets/wechat.jpg" alt="微信支付" width={250} height={375} />
      </Box>
      </Card>
    </Box>
    </Box>
    </Layout>
  );
};