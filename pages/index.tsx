import { Card, CardContent, Link, Typography } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import Toolbar from '@mui/material/Toolbar';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three'; // 引入three.js库
import Copyright from '../components/Copyright';
import apiClient from "../src/http/http";

export default function Home() {
  const [statistics, setStatistics] = useState(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await apiClient.get('v1/info/statistics');
        setStatistics(response);
      } catch (error) {
        console.log(error);
      }
    };

    fetchStatistics();
  }, []);

  useEffect(() => {
    if (containerRef.current) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, containerRef.current.offsetWidth / containerRef.current.offsetHeight, 0.1, 1000);
    camera.position.z = 5;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.offsetWidth, containerRef.current.offsetHeight);
    // 将渲染器的背景色设置为白色
    renderer.setClearColor(0xffffff, 1);
    containerRef.current.appendChild(renderer.domElement);
    
    const material = new THREE.LineBasicMaterial({ color: 0x000000 }); // 将材质的线条颜色设置为黑色
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const numPoints = 20;

    for (let i = 0; i < numPoints; i++) {
      const x = Math.random() * 8 - 2;
      const y = Math.random() * 8 - 2;
      const z = Math.random() * 8 - 2;
      positions.push(x, y, z);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const line = new THREE.Line(geometry, material);
    scene.add(line);

    const animate = function () {
      requestAnimationFrame(animate);
      line.rotation.x += 0.01;
      line.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      containerRef.current.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }
  }, []);

  return (
     <React.Fragment>
      <Box
        ref={containerRef}
        sx={{
          position: 'absolute',
          zIndex: -1,
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          // 使动画固定 不随滚动条滚动
          transform: 'translateZ(0)',
        }}
      />
      <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
      <CssBaseline />
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
      >
        <Toolbar sx={{ flexWrap: 'wrap' }}> 
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            ME Frp 镜缘映射
          </Typography>
          <Link href="https://qm.qq.com/q/rWsYtraZ1e">QQ 群</Link>
          <Button href="auth/register" variant="outlined" sx={{ my: 1, mx: 1.5 }}>
            注册
          </Button>
        </Toolbar>
      </AppBar>
      {/* Hero unit */}
      <Container disableGutters  component="main" sx={{ pt: 8, pb: 6 }}>
        <Typography
          component="h2"
          variant="h4"
          align="center"
          color="text.primary"
          gutterBottom
        >
          ME Frp 镜缘映射
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" component="p">
        免费 公益 好用 低延迟 稳定的Frp内网穿透
        </Typography>
              <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
            <Box maxWidth="sm">
            <Card variant="outlined">
          <Button variant="contained"
           href="auth/login">
            开始使用
          </Button>
          </Card>
        </Box>
        </Box>
      </Container>
      {statistics && (
        <Container disableGutters maxWidth="sm" component="section" sx={{ pt: 4, pb: 2 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                统计信息
              </Typography>
              <Typography variant="body1" gutterBottom>
                节点数量：{statistics.nodeCount}
              </Typography>
              <Typography variant="body1" gutterBottom>
                映射数量：{statistics.proxyCount}
              </Typography>
              <Typography variant="body1" gutterBottom>
                今日流量：{(statistics.trafficSum / 1024 / 1024 / 1024).toFixed(2)} GB
              </Typography>
              <Typography variant="body1" gutterBottom>
                用户数量：{statistics.userCount}
              </Typography>
            </CardContent>
          </Card>
        </Container>
      )}
      <Container disableGutters maxWidth="sm" component="section" sx={{ pt: 4, pb: 2 }}>
      <Box display="flex">
            <Box flex={1} mr={1}>
      <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              节点线路优质
            </Typography>
            <Typography variant="body1" gutterBottom>
              服务器线路优质。
              部分节点支持 IPv6，可用于 IPv6 环境下的内网穿透。
            </Typography>
          </CardContent>
        </Card>
        </Box>
        <Box flex={1} ml={1}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              美观，高性能
            </Typography>
            <Typography variant="body1" gutterBottom>
            后端使用 Golang 语言编写，性能优异，内存占用低，支持高并发。
            前端使用 Next.js 框架编写，界面简洁，操作方便。
            基于 Golang 编写的开源项目 Frp 内网穿透，支持 TCP、UDP、HTTP、HTTPS 多种协议。
            </Typography>
          </CardContent>
        </Card>
        </Box>
        <Box flex={1} ml={1}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" gutterBottom>
             简单 易用 方便联机
            </Typography>
            <Typography variant="body1" gutterBottom>
              修改版 Frp 客户端，支持简单启动，支持 Windows、Linux、MacOS 等多种操作系统，让你一键联机 Minecraft 、泰拉瑞亚 等基于 TCP/UDP 协议的游戏。
            </Typography>
          </CardContent>
        </Card>
        </Box>
        </Box>
      </Container>

  
      <Container disableGutters maxWidth="sm" component="section" sx={{ pb: 4 }}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              联系我们
            </Typography>
            <Typography variant="body1" gutterBottom>
              QQ 群： 772054227<br />
              邮箱：admin@mcserverx.com <br />
              团队 Github 地址：<Link href="https://github.com/ME-Frp">链接</Link>
              <br />
              团队官网：<Link href="https://www.mcserverx.com">链接</Link>
            </Typography>
          </CardContent>
        </Card>
      </Container>
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
