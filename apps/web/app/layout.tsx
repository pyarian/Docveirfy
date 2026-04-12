'use client'; // REQUIRED because wallet uses hooks

import { useMemo } from 'react';

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { clusterApiUrl } from '@solana/web3.js';

import '@solana/wallet-adapter-react-ui/styles.css';
//import '../styles/globals.css';

const endpoint = 'https://devnet.helius-rpc.com/?api-key=b27ebc27-02bd-4ccd-8b45-2070a895e357';

export default function Rootlayout({children} : { children: React.ReactNode }) {
  
  return (
    <html lang="en">
      <body>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={[]} autoConnect>
            <WalletModalProvider>
              {children}
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </body>
    </html>
  );
}