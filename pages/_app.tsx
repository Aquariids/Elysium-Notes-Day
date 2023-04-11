import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import Layout from '../layout/Layout'
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {


  return (
        <SessionProvider session={session}>
        <Component {...pageProps} />
        </SessionProvider>
  )


}