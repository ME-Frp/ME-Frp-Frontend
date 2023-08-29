/*
 * @Author: Aehxy ahmrcxy@gmail.com
 * @Date: 2023-07-12 20:53:54
 * @LastEditors: Aehxy ahmrcxy@gmail.com
 * @LastEditTime: 2023-08-30 00:28:02
 * @FilePath: \ME-Frp-Frontend\components\Copyright.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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
    <MuiLink color="inherit" href="https://cfu.mefrp.com/">
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
