import "../styles/globals.scss";
import type { AppProps } from "next/app";
import { Providers } from "@/Components/Providers";
import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {


  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = () => {
      setLoading(true);
    };

    const handleLoad = () => {
      setLoading(false);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("load", handleLoad);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("load", handleLoad);
    };
  }, [pageProps]);

  return <>{loading ? <p>Ты да</p> : <SessionProvider session={session}> <Component {...pageProps} /></SessionProvider>}</>

}
