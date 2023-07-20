import "../styles/globals.scss";
import type { AppProps } from "next/app";
import { Providers } from "@/Components/Providers";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <Providers>
      {/* <TextEditorProvider> */}
      <Component {...pageProps} />
      {/* </TextEditorProvider> */}
    </Providers>
  );
}
