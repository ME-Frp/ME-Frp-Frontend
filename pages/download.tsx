import Layout from '@components/Layout';
import Message from "@components/Message";
import { NoSsr } from '@mui/base';
import { Button, ButtonGroup, Card, CardContent, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { useState } from 'react';

export default function DownloadPage() {
    const sourceUrls = [
        {
            link: 'https://i.aqinco.com/mefrp/',
            name: '[境内]ME Frp 下载站/樱雨云'
        },
        {
            link: 'https://github.com/ME-Frp/ME-Frp-Core/releases/download/ME-Frp-0.51.3/',
            name: '[境外]Github Release'
        }
    ];

    const files = [
        {
            name: 'MirrorEdgeFrp_0.51.3_windows_amd64.zip',
            architecture: 'amd64',
            system: 'windows',
            type: 'PureCli',
            description: 'Windows CLI 启动器',
            link: 'MirrorEdgeFrp_0.51.3_windows_amd64.zip'
        },
        {
            name: 'MEFrp-Launcher_x64_Setup.exe',
            architecture: 'amd64',
            system: 'windows',
            type: '图形化',
            description: 'Windows 图形化 启动器',
            link: 'MEFrp-Launcher_x64_Setup.exe'
        },
        {
            name: 'MEFrp-Launcher_x86_Setup.exe',
            architecture: '386',
            system: 'windows',
            type: '图形化',
            description: 'Windows 图形化 启动器',
            link: 'MEFrp-Launcher_x86_Setup.exe'
        },
        {
            name: 'MirrorEdgeFrp_0.51.3_linux_amd64.tar.gz',
            architecture: 'amd64',
            system: 'linux',
            type: 'PureCli',
            link: 'MirrorEdgeFrp_0.51.3_linux_amd64.tar.gz'
        },
        {
            name: 'MirrorEdgeFrp_0.51.3_darwin_amd64.tar.gz',
            architecture: 'amd64',
            system: 'darwin',
            type: 'PureCli',
            link: 'MirrorEdgeFrp_0.51.3_darwin_amd64.tar.gz'
        },
        {
            name: 'MirrorEdgeFrp_0.51.3_linux_arm.tar.gz',
            architecture: 'arm',
            system: 'linux',
            type: 'PureCli',
            link: 'MirrorEdgeFrp_0.51.3_linux_arm.tar.gz'
        },
        {
            name: 'MirrorEdgeFrp_0.51.3_linux_arm64.tar.gz',
            architecture: 'arm64',
            system: 'linux',
            type: 'PureCli',
            link: 'MirrorEdgeFrp_0.51.3_linux_arm64.tar.gz'
        },
        {
            name: 'MirrorEdgeFrp_0.51.3_linux_mips64.tar.gz',
            architecture: 'mips64',
            system: 'linux',
            type: 'PureCli',
            link: 'MirrorEdgeFrp_0.51.3_linux_mips64.tar.gz'
        },
        {
            name: 'MirrorEdgeFrp_0.51.3_linux_mips64le.tar.gz',
            architecture: 'mips64le',
            system: 'linux',
            type: 'PureCli',
            link: 'MirrorEdgeFrp_0.51.3_linux_mips64le.tar.gz'
        },
        {
            name: 'MirrorEdgeFrp_0.51.3_linux_mips.tar.gz',
            architecture: 'mips',
            system: 'linux',
            type: 'PureCli',
            link: 'MirrorEdgeFrp_0.51.3_linux_mips.tar.gz'
        },
        {
            name: 'MirrorEdgeFrp_0.51.3_linux_mipsle.tar.gz',
            architecture: 'mipsle',
            system: 'linux',
            type: 'PureCli',
            link: 'MirrorEdgeFrp_0.51.3_linux_mipsle.tar.gz'
        },
        {
            name: 'MirrorEdgeFrp_0.51.3_darwin_arm64.tar.gz',
            architecture: 'arm64',
            system: 'darwin',
            type: 'PureCli',
            link: 'MirrorEdgeFrp_0.51.3_darwin_arm64.tar.gz'
        },
        {
            name: 'MirrorEdgeFrp_0.51.3_freebsd_386.tar.gz',
            architecture: '386',
            system: 'freebsd',
            type: 'PureCli',
            link: 'MirrorEdgeFrp_0.51.3_freebsd_386.tar.gz'
        },
        {
            name: 'MirrorEdgeFrp_0.51.3_freebsd_amd64.tar.gz',
            architecture: 'amd64',
            system: 'freebsd',
            type: 'PureCli',
            link: 'MirrorEdgeFrp_0.51.3_freebsd_amd64.tar.gz'
        },
        {
            name: 'MirrorEdgeFrp_0.51.3_linux_riscv64.tar.gz',
            architecture: 'riscv64',
            system: 'linux',
            type: 'PureCli',
            link: 'MirrorEdgeFrp_0.51.3_linux_riscv64.tar.gz'
        },
    ];
    const [selectedSource, setSelectedSource] = useState(sourceUrls[0].link);
    const [selectedLauncher, setSelectedLauncher] = useState('');
    const [selectedSystem, setSelectedSystem] = useState('');
    const [selectedArchitecture, setSelectedArchitecture] = useState('');


    const handleCopyLink = (link: string) => {
        navigator.clipboard.writeText(link).then(() => {
            Message.success({content: "复制成功!", duration: 1000})
        }, (err) => {
            console.error('Async: Could not copy text: ', err);
        });
    };

    const filteredFiles = files.filter((file) => {
        if (!selectedSystem || file.system === selectedSystem) {
            if (!selectedArchitecture || file.architecture === selectedArchitecture) {
                if (!selectedLauncher || file.type === selectedLauncher) {
                    return true;
                }
            }
        }
        return false;
    });

    return (
        <Layout>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">
                                下载中心
                            </Typography>
                            <TextField
                                select
                                label="下载源"
                                value={selectedSource}
                                onChange={(e) => setSelectedSource(e.target.value)}
                                fullWidth
                                sx={{marginBottom: '1rem'}}
                            >
                                {sourceUrls.map((source, index) => (
                                    <MenuItem key={index} value={source.link}>
                                        {source.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                select
                                label="启动器类型"
                                value={selectedLauncher}
                                onChange={(e) => setSelectedLauncher(e.target.value)}
                                fullWidth
                                sx={{marginBottom: '1rem'}}
                            >
                                <MenuItem value="图形化">图形化</MenuItem>
                                <MenuItem value="PureCli">CLI</MenuItem>
                                {/* 其他启动器类型选项 */}
                            </TextField>
                            <TextField
                                select
                                label="系统"
                                value={selectedSystem}
                                onChange={(e) => setSelectedSystem(e.target.value)}
                                fullWidth
                                sx={{marginBottom: '1rem'}}
                            >
                                <MenuItem value="windows">Windows</MenuItem>
                                <MenuItem value="linux">Linux</MenuItem>
                                <MenuItem value="macOS">MacOS</MenuItem>
                                <MenuItem value="freeBSD">FreeBSD</MenuItem>
                                {/* 其他系统选项 */}
                            </TextField>
                            <TextField
                                select
                                label="架构"
                                value={selectedArchitecture}
                                onChange={(e) => setSelectedArchitecture(e.target.value)}
                                fullWidth
                            >
                                <MenuItem value="amd64">amd64</MenuItem>
                                <MenuItem value="arm">arm</MenuItem>
                                <MenuItem value="arm64">arm64</MenuItem>
                                <MenuItem value="386">386</MenuItem>
                                <MenuItem value="mips">mips</MenuItem>
                                <MenuItem value="mipsle">mipsle</MenuItem>
                                <MenuItem value="mips64">mips64</MenuItem>
                                <MenuItem value="mips64le">mips64le</MenuItem>
                                <MenuItem value="riscv64">riscv64</MenuItem>
                                {/* 其他架构选项 */}
                            </TextField>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">
                                可用文件列表
                            </Typography>
                            <NoSsr>
                                {filteredFiles.map((file, index) => (
                                    <Card elevation={3} key={index} sx={{marginBottom: '1rem'}}>
                                        <CardContent>
                                            <Typography variant="subtitle1">{file.name}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                系统架构: {file.architecture}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                系统名称: {file.system}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                启动器类型: {file.type}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                描述: {file.description}
                                            </Typography>
                                            <ButtonGroup variant="contained" aria-label="outlined primary button group">
                                                <Button
                                                    href={selectedSource + file.link}
                                                    variant="contained"
                                                    sx={{marginTop: '1rem'}}
                                                >
                                                    下载
                                                </Button>
                                                <Button
                                                    onClick={() => handleCopyLink(selectedSource + file.link)}
                                                    variant="contained"
                                                    sx={{marginTop: '1rem'}}
                                                >
                                                    复制链接
                                                </Button>
                                            </ButtonGroup>
                                        </CardContent>
                                    </Card>
                                ))}
                            </NoSsr>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Layout>
    );
};
