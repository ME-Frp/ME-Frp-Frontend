import { CacheProvider, EmotionCache } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import data from "../pages/data.json";
import api from '../src/config/config';
import createEmotionCache from '../src/createEmotionCache';
import theme from '../src/theme';
import "../src/ts.css";
// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}
export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const router = useRouter();
  const [pageTitle, setPageTitle] = useState("");

  useEffect(() => {
    // 获取当前路由路径
    const { pathname } = router;
    
    // 从data.json中根据路径获取对应的标题

    let title = pathname === "/" ? data["home"] : data[pathname] || "未知页面";
    
    // 设置页面标题
    setPageTitle(title || "未知页面");
  }, [router]);
  useEffect(() => {console.log("API endpoint " + api.api)
})
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>{pageTitle}</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  );
}
