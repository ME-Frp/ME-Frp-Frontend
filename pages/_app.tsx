import { CacheProvider, EmotionCache } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect } from "react";
import api from '../src/config/config';
import createEmotionCache from '../src/createEmotionCache';
import theme from '../src/theme';
// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  useEffect(() => {console.log("API endpoint " + api.api)
})
  return (
    <CacheProvider value={emotionCache}>
      <Head>
      <title>MirrorEdge Frp [ME Frp] 镜缘映射</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9935177840178210" crossOrigin="anonymous"></script>
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  );
}
