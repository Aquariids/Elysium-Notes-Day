import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react";
import { TextEditorProvider } from '@/Components/TextEditor2/context';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {

  return (
    <SessionProvider session={session}>
      <TextEditorProvider>
        <Component {...pageProps} />
      </TextEditorProvider>
    </SessionProvider>

  )

}