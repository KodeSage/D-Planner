import Layout from "../components/Layout";
import "../styles/globals.css";
import '@rainbow-me/rainbowkit/styles.css';

import { getDefaultWallets, RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";

// const NEXT_PUBLIC_ALCHEMY_ID = process.env.NEXT_PUBLIC_ALCHEMY_ID;

const { chains, provider } = configureChains(
  [chain.polygonMumbai],
  [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Decentralized Planner",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const darTheme = darkTheme( {
  accentColor: '#7b3fe4',
  accentColorForeground: 'white',
  borderRadius: 'small',
  fontStack: 'system',
  overlayBlur: 'small',
} );

export default function MyApp({ Component, pageProps }) {
  return (
 <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={darTheme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
