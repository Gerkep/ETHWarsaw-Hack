import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import { RainbowKitProvider, getDefaultWallets, lightTheme } from '@rainbow-me/rainbowkit';
import { Mainnet, DAppProvider, useEtherBalance, useEthers, Config, Goerli } from '@usedapp/core'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { getDefaultProvider } from 'ethers'
import { publicProvider } from 'wagmi/providers/public';

const { chains, provider, webSocketProvider } = configureChains(
  [
  chain.goerli
  ],
  [
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'Staverse',
  chains,
});
const config = {
  networks: [Goerli],
}
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} 
            theme={lightTheme({
              accentColor: '#4f45e4',
              accentColorForeground: 'white',
              borderRadius: 'medium',
            })}>
        <DAppProvider config={config}>
          <Component {...pageProps} />
        </DAppProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
