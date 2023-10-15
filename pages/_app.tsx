/*
 * @Author: Aehxy ahmrcxy@gmail.com
 * @Date: 2023-07-12 20:53:54
 * @LastEditors: Aehxy ahmrcxy@gmail.com
 * @LastEditTime: 2023-10-15 14:59:45
 * @FilePath: \ME-Frp-Frontend\pages\_app.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { CacheProvider, EmotionCache } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect } from "react";
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
  useEffect(() => {console.log("API endpoint " + api.api)
})
  return (
    <CacheProvider value={emotionCache}>
      <Head>
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
