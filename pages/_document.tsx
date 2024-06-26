import { documentGetInitialProps, DocumentHeadTags, DocumentHeadTagsProps, } from '@mui/material-nextjs/v14-pagesRouter';
import { roboto } from '@src/theme';
import { useTheme } from "next-themes";
import { DocumentContext, DocumentProps, Head, Html, Main, NextScript } from 'next/document';

export default function MyDocument(props: DocumentProps & DocumentHeadTagsProps) {
    const {resolvedTheme} = useTheme();
    const theme = resolvedTheme == "dark" ? "dark" : "light";
  return (
      <Html lang="zh-CN" className={roboto.className}>
          <Head>
              {/* PWA primary color */}
              <meta name="theme-color" content={theme}/>
              <link rel="shortcut icon"
                    href="https://www.mefrp.com/favicon.ico"
                    type="image/x-icon"/>

              <meta name="emotion-insertion-point" content=""/>
              <meta name="description"
                    content="ME Frp 镜缘映射是一个免费内网穿透服务，可以通过 ME Frp 进行 联机、开发、调试等工作，是中国内网穿透联盟成员。"/>
              <meta name="keywords"
                    content="控制面板,Frp,我的世界开服,内网穿透,端口映射,免费frp,镜缘映射,MEFrp,CFU,中国内网穿透联盟"/>
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
