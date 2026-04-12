'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function Verify() {
  return (
    <main>
      <h1>Verify Document</h1>
      <WalletMultiButton />
    </main>
  );
}