import React from 'react';
import { Wallet } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface MetaMaskAuthProps {
  onConnect: (account: string) => void;
  connectionStatus: string;
  connectedWallet: string | null;
}

const MetaMaskAuth: React.FC<MetaMaskAuthProps> = ({
  onConnect,
  connectionStatus,
  connectedWallet,
}) => {
  return (
    <div className="bg-white shadow-sm p-4 mb-6">
      <div className="flex justify-between items-center max-w-4xl mx-auto">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-blue-600">XMRT Asset Tokenizer</h1>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Beta</span>
        </div>
        <button
          onClick={() => onConnect(connectedWallet || '')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
            connectionStatus === 'connected' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          <Wallet size={16} />
          <span>
            {connectionStatus === 'connected' 
              ? `Connected: ${connectedWallet?.slice(0, 6)}...${connectedWallet?.slice(-4)}` 
              : connectionStatus === 'connecting' 
                ? 'Connecting...' 
                : 'Connect MetaMask'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default MetaMaskAuth;