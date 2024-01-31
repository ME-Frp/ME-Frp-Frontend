import * as React from 'react';
import Head from 'next/head';
import {AppProps} from 'next/app';
import {AppCacheProvider} from '@mui/material-nextjs/v14-pagesRouter';
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { darkTheme, lightTheme } from '../src/theme';
import {DevSupport} from "@react-buddy/ide-toolbox-next";
import {ComponentPreviews, useInitial} from "../src/dev";
import {useMediaQuery} from "@mui/material";

export default function MyApp(props: AppProps) {
    const { Component, pageProps } = props;
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    return (
        <AppCacheProvider {...props}>
            <Head>
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
