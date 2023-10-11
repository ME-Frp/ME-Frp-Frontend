/*
 * @Author: Aehxy ahmrcxy@gmail.com
 * @Date: 2023-07-18 15:21:52
 * @LastEditors: Aehxy ahmrcxy@gmail.com
 * @LastEditTime: 2023-10-11 19:42:32
 * @FilePath: \ME-Frp-Frontend\pages\Panel\sponsor.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Box, Button, Card, CardContent, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import apiClient from '../../src/http/http';

type Sponsor = {
  id: number;
  email: string;
  name: string;
  thing: string;
  comment: string;
};

const SponsorPage = () => {
  const [sponsors, setSponsors] = useState(null);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const response = await apiClient.get('/v4/public/info/sponsor');
        setSponsors(response);
      } catch (error) {
        console.error('Error fetching sponsors:', error);
      }
    };

    fetchSponsors();
  }, []);

  return (
    <Layout>
            <Box display="flex">
            <Box flex={1} mr={1} style={{ height: "100%" }}>
      <Paper elevation={3} style={{ padding: '20px', height: "100%", marginBottom: '20px' }}>
        <Typography variant="h5" gutterBottom>
          赞助我们
        </Typography>
        <img src="https://www.mcserverx.com/wp-content/uploads/2023/07/0c9df74d815c742123f419d96355983a.jpg"alt="支付宝" style={{ width: '200px', marginRight: '10px' }} />
        <img src="https://www.mcserverx.com/wp-content/uploads/2023/07/6459b8278af85c6d2e12a4b8e9822a11.jpg" alt="微信支付" style={{ width: '200px' }} />
        <Typography variant="body1" gutterBottom> 你的支持是我们最大的动力！</Typography>
        <Typography variant="body1" gutterBottom> 不要忘记备注您的用户名、邮箱和留言哦！</Typography>
        <Button href="https://afdian.net/a/aehxy" variant="contained" >爱发电</Button>
        <Button href="https://qm.qq.com/q/Ob3I1Gu52y" variant="contained" >QQ(节点赞助/合作需求)</Button>
      </Paper>
      </Box>
      <Box flex={1} ml={1} style={{ height: "100%" }}>
      <Card  style={{ padding: '20px', height: "100%", marginBottom: '20px' }}>
      <CardContent>
        <Typography variant="h5" component="div">官方推荐</Typography>
        <br />
        <Typography variant="body1"> 樱雨云，安全领域的领导者。我们提供丰富、安全、稳定的产品及服务，领导并支持客户的云，提供中英文控制面板， 安全组策略，CC/DDOS隔离，网站入侵自动化监测，人工7*24小时服务。</Typography>
        </CardContent>
         </Card>
        </Box>
        </Box>
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h5" gutterBottom>
          赞助者列表
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>姓名</TableCell>
                <TableCell>邮箱</TableCell>
                <TableCell>赞助事项</TableCell>
                <TableCell>留言</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sponsors ? sponsors.map((sponsor) => (
                <TableRow key={sponsor.id}>
                  <TableCell>{sponsor.name}</TableCell>
                  <TableCell>{sponsor.email}</TableCell>
                  <TableCell>{sponsor.thing}</TableCell>
                  <TableCell>{sponsor.comment}</TableCell>
                </TableRow>
              )) : null}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Layout>
  );
              }
              export default SponsorPage;