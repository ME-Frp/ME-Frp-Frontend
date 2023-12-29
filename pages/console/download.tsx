import { NoSsr } from '@mui/base';
import { Card, CardContent, Link, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import Layout from '../../components/Layout';

export default function DownloadPage() {
  const url = 'https://download.mefrp.com:8123/' 
  const files = [
    {
        name: 'MirrorEdgeFrp_0.51.3_windows_386.zip',
        architecture: '386',
        system: 'windows',
        link: 'MirrorEdgeFrp_0.51.3_windows_386.zip'
    },
    {
        name: 'MirrorEdgeFrp_0.51.3_windows_amd64.zip',
        architecture: 'amd64',
        system: 'windows',
        link: 'MirrorEdgeFrp_0.51.3_windows_amd64.zip'
    },
    {
        name: 'MirrorEdgeFrp_0.51.3_linux_386.tar.gz',
        architecture: '386',
        system: 'linux',
        link: 'MirrorEdgeFrp_0.51.3_linux_386.tar.gz'
    },
    {
        name: 'MirrorEdgeFrp_0.51.3_linux_amd64.tar.gz',
        architecture: 'amd64',
        system: 'linux',
        link: 'MirrorEdgeFrp_0.51.3_linux_amd64.tar.gz'
    },
    {
      name: 'MirrorEdgeFrp_0.51.3_darwin_amd64.tar.gz',
      architecture: 'amd64',
      system: 'darwin',
      link: 'MirrorEdgeFrp_0.51.3_darwin_amd64.tar.gz'
    },
    {
        name: 'MirrorEdgeFrp_0.51.3_linux_arm.tar.gz',
        architecture: 'arm',
        system: 'linux',
        link: 'MirrorEdgeFrp_0.51.3_linux_arm.tar.gz'
    },
    {
        name: 'MirrorEdgeFrp_0.51.3_linux_arm64.tar.gz',
        architecture: 'arm64',
        system: 'linux',
        link: 'MirrorEdgeFrp_0.51.3_linux_arm64.tar.gz'
    },
    {
        name: 'MirrorEdgeFrp_0.51.3_linux_mips64.tar.gz',
        architecture: 'mips64',
        system: 'linux',
        link: 'MirrorEdgeFrp_0.51.3_linux_mips64.tar.gz'
    },
    {
        name: 'MirrorEdgeFrp_0.51.3_linux_mips64le.tar.gz',
        architecture: 'mips64le',
        system: 'linux',
        link: 'MirrorEdgeFrp_0.51.3_linux_mips64le.tar.gz'
    },
    {
        name: 'MirrorEdgeFrp_0.51.3_linux_mips.tar.gz',
        architecture: 'mips',
        system: 'linux',
        link: 'MirrorEdgeFrp_0.51.3_linux_mips.tar.gz'
    },
    {
        name: 'MirrorEdgeFrp_0.51.3_linux_mipsle.tar.gz',
        architecture: 'mipsle',
        system: 'linux',
        link: 'MirrorEdgeFrp_0.51.3_linux_mipsle.tar.gz'
    },
    {
        name: 'MirrorEdgeFrp_0.51.3_darwin_arm64.tar.gz',
        architecture: 'arm64',
        system: 'darwin',
        link: 'MirrorEdgeFrp_0.51.3_darwin_arm64.tar.gz'
    },
    {
        name: 'MirrorEdgeFrp_0.51.3_freebsd_386.tar.gz',
        architecture: '386',
        system: 'freebsd',
        link: 'MirrorEdgeFrp_0.51.3_freebsd_386.tar.gz'
    },
    {
        name: 'MirrorEdgeFrp_0.51.3_freebsd_amd64.tar.gz',
        architecture: 'amd64',
        system: 'freebsd',
        link: 'MirrorEdgeFrp_0.51.3_freebsd_amd64.tar.gz'
    },
    {
        name: 'MirrorEdgeFrp_0.51.3_linux_riscv64.tar.gz',
        architecture: 'riscv64',
        system: 'linux',
        link: 'MirrorEdgeFrp_0.51.3_linux_riscv64.tar.gz'
    },
  ];

  return (
    <Layout>
      <Card>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            下载中心
          </Typography>
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
              <NoSsr>
                {files.map((file, index) => (
                  <TableRow key={index}>
                    <TableCell>{file.name}</TableCell>
                    <TableCell>{file.architecture}</TableCell>
                    <TableCell>{file.system}</TableCell>
                    <TableCell>
                      <Link href={url + file.link} download underline="hover">
                        点击这里下载
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </NoSsr>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Layout>
  );
};