import { Link as MuiLink, Typography } from '@mui/material';

export default function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <MuiLink color="inherit" href="https://www.aehxy.com/">
      Aehxy
      </MuiLink>{' '}
      2021-{new Date().getFullYear()}.
    <br />
    <MuiLink color="inherit" href="https://内网穿透. 中国/">
    Frp 内网穿透联盟统一识别编码:AZWB66WB
      </MuiLink>
      <br />
              <MuiLink color="inherit" href="https://beian.miit.gov.cn">蜀ICP备2023020251号</MuiLink>
              <br />
              <MuiLink color="inherit" href="https://beian.miit.gov.cn">增值电信业务许可证号: A2B1.B2-20223095号 </MuiLink>
              由中远咨询(辽宁)有限公司授权 
    </Typography>
  );
}
