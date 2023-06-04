import { ChakraBaseProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import { theme } from '../chakra/theme';
import Layout from '@/components/Layout/Layout';
import { RecoilRoot } from 'recoil';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <ChakraBaseProvider theme={theme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraBaseProvider>
    </RecoilRoot>
  );
}
