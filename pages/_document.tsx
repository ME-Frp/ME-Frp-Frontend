import * as React from 'react';
import {DocumentContext, DocumentProps, Head, Html, Main, NextScript} from 'next/document';
import {documentGetInitialProps, DocumentHeadTags, DocumentHeadTagsProps,} from '@mui/material-nextjs/v14-pagesRouter';
import {darkTheme, lightTheme, roboto} from '../src/theme';
import {useMediaQuery} from '@mui/material';

export default function MyDocument(props: DocumentProps & DocumentHeadTagsProps) {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const theme = prefersDarkMode ? darkTheme : lightTheme
  return (
      <Html lang="zh-CN" className={roboto.className}>
          <Head>
              {/* PWA primary color */}
              <meta name="theme-color" content={theme.palette.primary.main}/>
              <link rel="shortcut icon"
                    href="https://www.mefrp.com/favicon.ico"
                    type="image/x-icon"/>

              <meta name="emotion-insertion-point" content=""/>
              <meta name="description"
                    content="KL Frp 快连映射是一个免费内网穿透服务，可以通过 ME Frp 进行 联机、开发、调试等工作，是中国内网穿透联盟成员。"/>
              <meta name="keywords"
                    content="控制面板,Frp,我的世界开服,内网穿透,端口映射,免费frp,镜缘映射,KLFrp"/>
              <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
              <DocumentHeadTags {...props} />
          </Head>
          <body>
          <Main/>
          <NextScript/>
          </body>
      </Html>
  );
}

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
    return await documentGetInitialProps(ctx);
};
