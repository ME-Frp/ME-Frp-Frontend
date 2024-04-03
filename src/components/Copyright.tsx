import { Link as MuiLink, Typography } from '@mui/material';

export default function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <MuiLink color="inherit" href="https://www.aehxy.com/">
      Aehxy and PH.
      </MuiLink>{' '}
      2021-{new Date().getFullYear()}.
    <br />
    </Typography>
  );
}
