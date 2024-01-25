import { Box, Container, Typography } from '@mui/material';
import Copyright from '../components/Copyright';

export default function ServiceNotFoundPage() {

  return (
    <Container maxWidth="sm">
    <Box sx={{ my: 4 }}>
    <Typography variant="h2">Error 403</Typography>
          <Typography variant="h5">网站未找到</Typography>
          <Typography variant="h4">发生了什么 ?</Typography>
          <Typography variant="h5">您访问的网站使用了 ME Frp 镜缘映射 ，但是对应的客户端没有运行，因此该请求被重定向到了此处。</Typography>
          <Typography variant="h4">我该怎么办 ?</Typography>
          <Typography variant="h5">尝试与该网站的所有者取得联系。</Typography>
      <Copyright />
    </Box>
  </Container>
  );
};