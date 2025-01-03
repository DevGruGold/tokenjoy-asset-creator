import React from 'react';
import { Wallet } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

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
    <div className="space-y-4">
      <Button
        onClick={() => onConnect(connectedWallet || '')}
        className={`w-full text-lg py-6 ${
          connectionStatus === 'connected' 
            ? 'bg-green-500 hover:bg-green-600' 
            : 'bg-blue-500 hover:bg-blue-600'
        }`}
        disabled={connectionStatus === 'connecting'}
      >
        <Wallet className="mr-2 h-5 w-5" />
        {connectionStatus === 'connected' 
          ? `Connected: ${connectedWallet?.slice(0, 6)}...${connectedWallet?.slice(-4)}` 
          : connectionStatus === 'connecting' 
            ? 'Connecting...' 
            : 'Connect MetaMask'}
      </Button>

      {connectionStatus === 'error' && (
        <Alert variant="destructive">
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>
            Failed to connect to MetaMask. Please make sure you have MetaMask installed and try again.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default MetaMaskAuth;