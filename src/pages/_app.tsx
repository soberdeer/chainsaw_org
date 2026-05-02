import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { theme } from '../../theme';
import { Shell } from "@/components/Shell/Shell";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider theme={theme}>
      <Head>
        <title>Chaisaw Org</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
        <link rel="shortcut icon" href="/favicon.svg" />
      </Head>
      <Shell>
      <Component {...pageProps} />
      </Shell>
    </MantineProvider>
  );
}
