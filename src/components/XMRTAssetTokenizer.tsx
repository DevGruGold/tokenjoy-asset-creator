import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import WelcomeScreen from './welcome/WelcomeScreen';
import NFTDashboard from './dashboard/NFTDashboard';
import { ConnectionStatus, AssetType, AssetDetails } from '@/types/xmrt';

const TARGET_WALLET = '0xfdcfb99cb7b8f284cc310eae4cf4026484750210';

const connectMetaMask = async () => {
  try {
    if (typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      return accounts[0];
    }
    throw new Error('MetaMask not found');
  } catch (error) {
    console.error('MetaMask connection error:', error);
    throw error;
  }
};

const XMRTAssetTokenizer = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<AssetType | null>(null);
  const [assetDetails, setAssetDetails] = useState<AssetDetails>({});
  const [location, setLocation] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);
  const [mintingStatus, setMintingStatus] = useState<string | null>(null);
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');

  const handleConnectWallet = async () => {
    try {
      setConnectionStatus('connecting');
      const account = await connectMetaMask();
      setConnectedWallet(account);
      setConnectionStatus('connected');
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to MetaMask",
      });
    } catch (error) {
      setConnectionStatus('error');
      toast({
        title: "Connection Failed",
        description: "Failed to connect to MetaMask. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            setConnectedWallet(accounts[0]);
            setConnectionStatus('connected');
          }
        });

      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          setConnectedWallet(null);
          setConnectionStatus('disconnected');
        } else {
          setConnectedWallet(accounts[0]);
          setConnectionStatus('connected');
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);

  // Only show the main content if wallet is connected
  if (!connectedWallet || connectionStatus !== 'connected') {
    return (
      <WelcomeScreen
        onConnect={handleConnectWallet}
        connectionStatus={connectionStatus}
        connectedWallet={connectedWallet}
      />
    );
  }

  const ASSET_TYPES = {
    VEHICLE: {
      icon: '🚗',
      fields: ['VIN', 'Make', 'Model', 'Year', 'Color', 'Mileage'],
      chain: {
        CA: 'avalanche',
        default: 'ethereum'
      },
      xmrtPrefix: 'XMRT-VEH'
    },
    REAL_ESTATE: {
      icon: '🏠',
      fields: ['Address', 'Parcel Number', 'Square Footage', 'Year Built', 'Property Type'],
      chain: {
        CA: 'avalanche',
        default: 'ethereum'
      },
      xmrtPrefix: 'XMRT-RE'
    },
    ART: {
      icon: '🎨',
      fields: ['Title', 'Artist', 'Medium', 'Year Created', 'Dimensions'],
      chain: {
        default: 'ethereum'
      },
      xmrtPrefix: 'XMRT-ART'
    },
    COLLECTIBLE: {
      icon: '💎',
      fields: ['Name', 'Category', 'Condition', 'Year', 'Serial Number'],
      chain: {
        default: 'ethereum'
      },
      xmrtPrefix: 'XMRT-COL'
    }
  };

  const generateXMRTId = (type: AssetType, details: AssetDetails) => {
    const prefix = ASSET_TYPES[type].xmrtPrefix;
    const timestamp = Date.now().toString(36);
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    return `${prefix}-${timestamp}-${randomSuffix}`;
  };

  const mintXMRTToken = async (tokenId: string, metadata: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          tokenId,
          transaction: `0x${Math.random().toString(36).substring(2, 40)}`,
          timestamp: Date.now()
        });
      }, 2000);
    });
  };

  const handleMint = async (metadata: any) => {
    if (!connectedWallet) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    setMintingStatus('pending');
    const tokenId = generateXMRTId(selectedType!, metadata);
    
    try {
      const result = await mintXMRTToken(tokenId, {
        ...metadata,
        location,
        timestamp: Date.now(),
        targetWallet: TARGET_WALLET
      });
      
      setMintingStatus('complete');
      setStep(3);
      toast({
        title: "Success",
        description: "Your NFT has been successfully minted!",
      });
    } catch (error) {
      setMintingStatus('error');
      toast({
        title: "Error",
        description: "Failed to mint NFT. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTypeSelect = (type: AssetType) => {
    setSelectedType(type);
    setStep(2);
  };

  return (
    <NFTDashboard 
      connectedWallet={connectedWallet} 
      step={step}
      selectedType={selectedType}
      assetFields={selectedType ? ASSET_TYPES[selectedType].fields : []}
      onMint={handleMint}
    >
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Select Asset Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(ASSET_TYPES).map(([type, config]) => (
              <button
                key={type}
                onClick={() => handleTypeSelect(type as AssetType)}
                className="p-6 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <div className="text-4xl mb-2">{config.icon}</div>
                <div className="font-medium">{type.replace('_', ' ')}</div>
                <div className="text-sm text-gray-500 mt-1">{config.xmrtPrefix}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="text-center space-y-4">
          <CheckCircle2 className="mx-auto text-green-500 h-16 w-16" />
          <h2 className="text-2xl font-bold">Asset Successfully Tokenized!</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Token ID:</p>
            <p className="font-mono text-blue-600">
              {generateXMRTId(selectedType!, assetDetails)}
            </p>
          </div>
          <p className="text-gray-600">
            Your asset has been tokenized and linked to wallet:<br/>
            <span className="font-mono text-sm">{TARGET_WALLET}</span>
          </p>
          <button
            onClick={() => {
              setStep(1);
              setSelectedType(null);
              setAssetDetails({});
              setLocation('');
              setVerificationStatus(null);
              setMintingStatus(null);
            }}
            className="mt-4 w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Tokenize Another Asset
          </button>
        </div>
      )}
    </NFTDashboard>
  );
};

export default XMRTAssetTokenizer;
