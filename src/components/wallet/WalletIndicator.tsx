import React from 'react';
import { useAccount } from 'wagmi';
import { Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWeb3Modal } from '@web3modal/react';

const WalletIndicator = () => {
  const { address, isConnected } = useAccount();
  const { open } = useWeb3Modal();

  if (!isConnected) {
    return (
      <Button onClick={() => open()} variant="outline" className="gap-2">
        <Wallet className="h-4 w-4" />
        Connect Wallet
      </Button>
    );
  }

  return (
    <Button variant="outline" onClick={() => open()} className="gap-2">
      <Wallet className="h-4 w-4" />
      {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connected'}
    </Button>
  );
};

export default WalletIndicator;