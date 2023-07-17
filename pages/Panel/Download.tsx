import { Link, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import Layout from '../../components/Layout';
import NoSSR from '../../components/NoSSR';

export default function DownloadPage() {
  const files = [
    {
        name: 'MirrorEdgeFrp_0.46.1_windows_386.zip',
        architecture: '386',
        system: 'windows',
        link: 'https://download.mefrp.com/MirrorEdgeFrp_0.46.1_windows_386.zip'
    },
    {
        name: 'MirrorEdgeFrp_0.46.1_windows_amd64.zip',
        architecture: 'amd64',
        system: 'windows',
        link: 'https://download.mefrp.com/MirrorEdgeFrp_0.46.1_windows_amd64.zip'
    },
    {
        name: 'MirrorEdgeFrp_0.46.1_linux_386.tar.gz',
        architecture: '386',
        system: 'linux',
        link: 'https://download.mefrp.com/MirrorEdgeFrp_0.46.1_linux_386.tar.gz'
    },
    {
        name: 'MirrorEdgeFrp_0.46.1_linux_amd64.tar.gz',
        architecture: 'amd64',
        system: 'linux',
        link: 'https://download.mefrp.com/MirrorEdgeFrp_0.46.1_linux_amd64.tar.gz'
    },
    {
      name: 'MirrorEdgeFrp_0.46.1_darwin_amd64.tar.gz',
      architecture: 'amd64',
      system: 'darwin',
      link: 'https://download.mefrp.com/MirrorEdgeFrp_0.46.1_darwin_amd64.tar.gz'
    },
    {
        name: 'MirrorEdgeFrp_0.46.1_linux_arm.tar.gz',
        architecture: 'arm',
        system: 'linux',
        link: 'https://download.mefrp.com/MirrorEdgeFrp_0.46.1_linux_arm.tar.gz'
    },
    {
        name: 'MirrorEdgeFrp_0.46.1_linux_arm64.tar.gz',
        architecture: 'arm64',
        system: 'linux',
        link: 'https://download.mefrp.com/MirrorEdgeFrp_0.46.1_linux_arm64.tar.gz'
    },
    {
        name: 'MirrorEdgeFrp_0.46.1_linux_mips64.tar.gz',
        architecture: 'mips64',
        system: 'linux',
        link: 'https://download.mefrp.com/MirrorEdgeFrp_0.46.1_linux_mips64.tar.gz'
    },
    {
        name: 'MirrorEdgeFrp_0.46.1_linux_mips64le.tar.gz',
        architecture: 'mips64le',
        system: 'linux',
        link: 'https://download.mefrp.com/MirrorEdgeFrp_0.46.1_linux_mips64le.tar.gz'
    },
    {
        name: 'MirrorEdgeFrp_0.46.1_linux_mips.tar.gz',
        architecture: 'mips',
        system: 'linux',
        link: 'https://download.mefrp.com/MirrorEdgeFrp_0.46.1_linux_mips.tar.gz'
    },
    {
        name: 'MirrorEdgeFrp_0.46.1_linux_mipsle.tar.gz',
        architecture: 'mipsle',
        system: 'linux',
        link: 'https://download.mefrp.com/MirrorEdgeFrp_0.46.1_linux_mipsle.tar.gz'
    },
    {
        name: 'MirrorEdgeFrp_0.46.1_darwin_arm64.tar.gz',
        architecture: 'arm64',
        system: 'darwin',
        link: 'https://download.mefrp.com/MirrorEdgeFrp_0.46.1_darwin_arm64.tar.gz'
    },
    {
        name: 'MirrorEdgeFrp_0.46.1_freebsd_386.tar.gz',
        architecture: '386',
        system: 'freebsd',
        link: 'https://download.mefrp.com/MirrorEdgeFrp_0.46.1_freebsd_386.tar.gz'
    },
    {
        name: 'MirrorEdgeFrp_0.46.1_freebsd_amd64.tar.gz',
        architecture: 'amd64',
        system: 'freebsd',
        link: 'https://download.mefrp.com/MirrorEdgeFrp_0.46.1_freebsd_amd64.tar.gz'
    },
    {
        name: 'MirrorEdgeFrp_0.46.1_linux_riscv64.tar.gz',
        architecture: 'riscv64',
        system: 'linux',
        link: 'https://download.mefrp.com/MirrorEdgeFrp_0.46.1_linux_riscv64.tar.gz'
    },
  ];

  return (
    <Layout>
    <Paper>
     <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>文件名</TableCell>
              <TableCell>系统架构</TableCell>
              <TableCell>系统类型</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <NoSSR>
      {files.map((file, index) => (
         <TableRow key={index}>
           <TableCell>
            {file.name}
          </TableCell>
          <TableCell>
           {file.architecture}
          </TableCell>
          <TableCell>
            {file.system}
          </TableCell>
          <Link href={file.link} download underline="hover">
            点击这里下载
          </Link>
        </TableRow>
      ))}
      </NoSSR>
            </TableBody>
        </Table>
      </Paper>
      </Layout>
  );
};