import React from 'react';
import MetaMaskAuth from '../auth/MetaMaskAuth';
import { ConnectionStatus } from '@/types/xmrt';

interface WelcomeScreenProps {
  onConnect: (account: string) => void;
  connectionStatus: ConnectionStatus;
  connectedWallet: string | null;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onConnect,
  connectionStatus,
  connectedWallet,
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="text-center space-y-6 max-w-lg mx-auto p-8">
        <h1 className="text-4xl font-bold text-blue-600">XMRT Asset Tokenizer</h1>
        <p className="text-gray-600 text-lg">
          Connect your MetaMask wallet to start tokenizing your assets on the blockchain
        </p>
        <div className="mt-8">
          <MetaMaskAuth
            onConnect={onConnect}
            connectionStatus={connectionStatus}
            connectedWallet={connectedWallet}
          />
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;