import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import Layout from '../layout/Layout'
import Entrance from '@/Components/Entrance/Entrance'
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {

  if (!session) {
    return (
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    )
  }

  else {
    return (
      <SessionProvider session={session}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    )
  }

}