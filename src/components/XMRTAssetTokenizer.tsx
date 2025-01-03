import React, { useState, useEffect } from 'react';
import { AlertCircle, Upload, CheckCircle2, ArrowRight, Wallet, Link } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ConnectionStatus, AssetType, AssetTypeConfig, AssetDetails } from '@/types/xmrt';

const XMRT_BRAND_COLOR = '#0052CC';
const TARGET_WALLET = '0xfdcfb99cb7b8f284cc310eae4cf4026484750210';

const connectWallet = async () => {
  try {
    if (typeof window.ethereum !== 'undefined') {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      return accounts[0];
    }
    throw new Error('No wallet found');
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
};

const XMRTAssetTokenizer = () => {
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
      const account = await connectWallet();
      setConnectedWallet(account);
      setConnectionStatus('connected');
    } catch (error) {
      setConnectionStatus('error');
      console.error('Wallet connection error:', error);
    }
  };

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            setConnectedWallet(accounts[0]);
            setConnectionStatus('connected');
          }
        });
    }
  }, []);

  const Header = () => (
    <div className="bg-white shadow-sm p-4 mb-6">
      <div className="flex justify-between items-center max-w-4xl mx-auto">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-blue-600">XMRT Asset Tokenizer</h1>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Beta</span>
        </div>
        <button
          onClick={handleConnectWallet}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
            connectionStatus === 'connected' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          <Wallet size={16} />
          <span>
            {connectionStatus === 'connected' 
              ? `Connected: ${connectedWallet!.slice(0, 6)}...${connectedWallet!.slice(-4)}` 
              : connectionStatus === 'connecting' 
                ? 'Connecting...' 
                : 'Connect Wallet'}
          </span>
        </button>
      </div>
    </div>
  );

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

  const handleMint = async () => {
    if (!connectedWallet) {
      alert('Please connect your wallet first');
      return;
    }

    setMintingStatus('pending');
    const tokenId = generateXMRTId(selectedType!, assetDetails);
    
    try {
      const result = await mintXMRTToken(tokenId, {
        ...assetDetails,
        type: selectedType,
        location,
        timestamp: Date.now(),
        targetWallet: TARGET_WALLET
      });
      
      setMintingStatus('complete');
      setStep(5);
    } catch (error) {
      setMintingStatus('error');
      console.error('Minting error:', error);
    }
  };

  const handleTypeSelect = (type: AssetType) => {
    setSelectedType(type);
    setStep(2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto p-4">
        {!connectedWallet && step > 1 && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Wallet Connection Required</AlertTitle>
            <AlertDescription>
              Please connect your wallet to continue with the tokenization process.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between mb-8">
          {[1, 2, 3, 4, 5].map((stepNum) => (
            <div 
              key={stepNum}
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step >= stepNum ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              {stepNum}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
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

          {step === 5 && (
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
        </div>
      </div>
    </div>
  );
};

export default XMRTAssetTokenizer;