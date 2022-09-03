import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import { RainbowKitProvider, Chain, getDefaultWallets, lightTheme } from '@rainbow-me/rainbowkit';
import { Mainnet, DAppProvider, useEtherBalance, useEthers, Config, Goerli } from '@usedapp/core'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { getDefaultProvider } from 'ethers'
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

const sokolChain: Chain = {
  id: 77,
  network: 'sokol',
  name: 'Gnosis Testnet (Sokol)',
  nativeCurrency: {
    decimals: 18,
    name: 'SPOA',
    symbol: 'SPOA',
  },
  rpcUrls: {
    default: 'https://sokol.poa.network/',
  },
  blockExplorers: {
    default: { name: 'Blockscout', url: 'https://blockscout.com/poa/sokol' },
  },
  testnet: true,
  iconUrl: '/chains/gnosis.png',
};

const { provider, chains } = configureChains(
  [sokolChain],
  [jsonRpcProvider({ rpc: chain => ({ http: chain.rpcUrls.default }) })]
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
