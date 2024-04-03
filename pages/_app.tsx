import { AppCacheProvider } from '@mui/material-nextjs/v14-pagesRouter';
import { DevSupport } from "@react-buddy/ide-toolbox-next";
import { ThemeProvider } from 'next-themes';
import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from "next/router";
import { GoogleAdSense } from "nextjs-google-adsense";
import { ReactNode, useEffect, useState } from 'react';
import TagManager from 'react-gtm-module';
import ThemeProviderMui from "../src/components/ThemeProxiderMui";
import current, { TitleData } from "../src/config/config";
import { ComponentPreviews, useInitial } from "../src/dev";

interface TitleDataMap {
    [key: string]: string; // 索引签名
}
interface LayoutProps {
    children: ReactNode;
}
const TitleDataStr: TitleDataMap = TitleData
export default function MyApp(props: AppProps) {
    const { Component, pageProps } = props;
    const router = useRouter();
    const [pageTitle, setPageTitle] = useState("");

    const Layout = router.pathname.startsWith('/console')
    ? dynamic(() => import('../src/components/Layout'))
    : ({ children }: LayoutProps) => <>{children}</>;

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
            <ThemeProvider>
                <ThemeProviderMui>
                <GoogleAdSense publisherId="pub-9935177840178210" />
                <DevSupport ComponentPreviews={ComponentPreviews}
                            useInitialHook={useInitial}
                >
                    <Layout>
                    <Component {...pageProps} />
                    </Layout>
                </DevSupport>
                </ThemeProviderMui>
            </ThemeProvider>
        </AppCacheProvider>
    );
}
