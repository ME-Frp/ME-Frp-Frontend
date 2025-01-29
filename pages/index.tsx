import Copyright from '@components/Copyright';
import { AppBar, Box, Button, Card, CardContent, Container, CssBaseline, Grid, Link, Toolbar, Typography } from '@mui/material';
import Head from 'next/head';
import React from 'react';
export default function MEFrp() {
    return (
        <React.Fragment>
          <Head>
            <title>ME Frp | 幻缘映射 - 免费内网穿透_公益_端口映射_Minecraft我的世界联机_泰拉瑞亚联机_远程桌面</title>
          </Head>
            <CssBaseline />
            <AppBar position="relative">
                <Toolbar>
                    <Typography variant="h6" color="inherit" noWrap>
                        ME Frp 幻缘映射
                    </Typography>
                    <Box flexGrow={1} />
                    <Link href="https://qm.qq.com/q/pZaRHwiowi" color="inherit" sx={{ my: 1, mx: 1.5 }}>QQ 群</Link>
                    <Link href="console/home" color="inherit" sx={{ my: 1, mx: 1.5 }}>控制面板</Link>
                    <Button href="auth/register" color="inherit" variant="outlined" sx={{ my: 1, mx: 1.5 }}>
                        注册
                    </Button>
                </Toolbar>
            </AppBar>
            <main>
                {/* Hero unit */}
                <Container disableGutters component="main" sx={{ pt: 8, pb: 6 }}>
                    <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                        ME Frp 幻缘映射
                    </Typography>
                    <Typography variant="h5" align="center" color="textSecondary" paragraph>
                        免费 公益 好用 低延迟 稳定的Frp内网穿透
                    </Typography>
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item>
                            <Button variant="contained" color="primary" href="auth/login">
                                开始使用
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="outlined" color="primary" href="https://docs.mefrp.com">
                                文档
                            </Button>
                        </Grid>
                    </Grid>
                </Container>
                <Container maxWidth="md">
                    {/* End hero unit */}
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        节点线路优质
                                    </Typography>
                                    <Typography>
                                        服务器网络优质，多采用 BGP 线路，部分节点拥有 DDoS 防御。
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardContent>
                                    <Typography gutterBottom variant='h5' component="h2">
                                        美观，高性能
                                    </Typography>
                                    <Typography>
                                        后端使用 Golang 语言编写，性能优异，内存占用低，支持高并发。
                                        前端使用 Next.js 框架编写，使用 Material-UI 界面简洁，操作方便。
                                        基于 Golang 编写的开源项目 Frp 内网穿透，支持 TCP、UDP、HTTP、HTTPS 多种协议。
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card style={{ height: '100%', display: 'flex', flexDirection: 'column' }} >
                                <CardContent>
                                    <Typography gutterBottom variant='h5' component="h2">
                                        简单 易用 方便联机
                                    </Typography>
                                    <Typography>
                                        修改版 Frp 客户端，支持简单启动，支持 Windows、Linux、MacOS 等多种操作系统，让你一键联机 Minecraft 、泰拉瑞亚 等基于 TCP/UDP 协议的游戏。
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
                </main>
            {/* Footer */}
            <Container
                maxWidth="md"
                component="footer"
                sx={{
                    borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                    mt: 8,
                    py: [3, 6],
                }}
            >
                <Copyright />
            </Container>
            {/* End footer */}
        </React.Fragment>
    );
}
