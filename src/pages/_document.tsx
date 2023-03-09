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
          <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css'></link>
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