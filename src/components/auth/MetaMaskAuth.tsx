import React from 'react';
import { Wallet } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useWeb3Modal } from '@web3modal/react';

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
  const { open } = useWeb3Modal();

  const handleConnect = async () => {
    try {
      await open();
      if (connectedWallet) {
        onConnect(connectedWallet);
      }
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={handleConnect}
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
            : 'Connect Wallet'}
      </Button>

      {connectionStatus === 'error' && (
        <Alert variant="destructive">
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>
            Failed to connect wallet. Please try again.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default MetaMaskAuth;