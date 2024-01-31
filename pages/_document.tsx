import * as React from 'react';
import {DocumentContext, DocumentProps, Head, Html, Main, NextScript} from 'next/document';
import {documentGetInitialProps, DocumentHeadTags, DocumentHeadTagsProps,} from '@mui/material-nextjs/v14-pagesRouter';
import {darkTheme, lightTheme, roboto} from '../src/theme';
import {useMediaQuery} from '@mui/material';

export default function MyDocument(props: DocumentProps & DocumentHeadTagsProps) {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const theme = prefersDarkMode ? darkTheme : lightTheme
  return (
    <Html lang="en" className={roboto.className}>
      <Head>
        {/* PWA primary color */}
        <meta name="theme-color" content={theme.palette.primary.main} />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="emotion-insertion-point" content="" />
        <DocumentHeadTags {...props} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
    return await documentGetInitialProps(ctx);
};
