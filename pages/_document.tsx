import Document , { Html, Head, Main, NextScript, DocumentContext, DocumentInitialProps} from 'next/document'



class MyDocument extends Document {
  static async getInitialProps(ctx:DocumentContext):Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx);
    return {...initialProps}
  }
  render(): JSX.Element {
    return(
      <Html lang='ru'>
          <Head>
            
          <meta charSet="utf-8" />
          <link rel="icon" href="/favicon.ico" type="image/x-icon" />
<link rel="icon" type="image/png" href="favicon-32x32.png" sizes="32x32"/>
<link rel="icon" type="image/png" href="favicon-16x16.png" sizes="16x16"/>
          </Head>
          <body>
            <Main/>
            <NextScript/>
          </body>
      </Html>
    )
  }
}

export default MyDocument;