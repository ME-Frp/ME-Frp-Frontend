import * as React from 'react';
import {useEffect, useState} from 'react';
import Head from 'next/head';
import {AppProps} from 'next/app';
import {AppCacheProvider} from '@mui/material-nextjs/v14-pagesRouter';
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {darkTheme, lightTheme} from '../src/theme';
import {DevSupport} from "@react-buddy/ide-toolbox-next";
import {ComponentPreviews, useInitial} from "../src/dev";
import {useMediaQuery} from "@mui/material";
import {useRouter} from "next/router";
import TagManager from 'react-gtm-module'
import current, {TitleData} from "../src/config/config";

interface TitleDataMap {
    [key: string]: string; // 索引签名
}

const TitleDataStr: TitleDataMap = TitleData
export default function MyApp(props: AppProps) {
    const { Component, pageProps } = props;
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const router = useRouter();
    const [pageTitle, setPageTitle] = useState("");

    useEffect(() => {
        // 获取当前路由路径
        const {pathname} = router;

        // 从data.json中根据路径获取对应的标题

        let title = (pathname === "/") ? null : current.title + (TitleDataStr[pathname.replace("/", "")] as string);

        // 设置页面标题
        setPageTitle(title || "未知页面");
    }, [router]);
    useEffect(() => {
        console.log("API endpoint " + current.api)
    })
    useEffect(() => {
        TagManager.initialize({ gtmId: 'GTM-WBW467SJ' });
    }, []);
    return (
        <AppCacheProvider {...props}>
            <Head>
                {pageTitle !== null ? (
                    <title>{pageTitle}</title>
                ) : null
                }
                <meta name="viewport" content="initial-scale=1, width=device-width"/>
            </Head>
            <ThemeProvider theme={prefersDarkMode ? darkTheme : lightTheme}>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline/>
                <DevSupport ComponentPreviews={ComponentPreviews}
                            useInitialHook={useInitial}
                >
                    <Component {...pageProps} />
                </DevSupport>
            </ThemeProvider>
        </AppCacheProvider>
    );
}
