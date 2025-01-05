import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import WelcomeScreen from './welcome/WelcomeScreen';
import NFTDashboard from './dashboard/NFTDashboard';
import SuccessScreen from './success/SuccessScreen';
import ContractInitializer from './contract/ContractInitializer';
import { ASSET_TYPES, TARGET_WALLET } from '@/config/constants';
import { ConnectionStatus, AssetType, AssetDetails } from '@/types/xmrt';
import { mintNFTToCollection } from '@/utils/smartContract';
import { useWeb3Modal } from '@web3modal/react';
import { useAccount } from 'wagmi';

const XMRTAssetTokenizer = () => {
  const { toast } = useToast();
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<AssetType | null>(null);
  const [assetDetails, setAssetDetails] = useState<AssetDetails>({});
  const [location, setLocation] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);
  const [mintingStatus, setMintingStatus] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [isContractDeployed, setIsContractDeployed] = useState(false);

  const handleConnectWallet = async () => {
    try {
      setConnectionStatus('connecting');
      await open();
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
    if (isConnected && address) {
      setConnectionStatus('connected');
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to wallet",
      });
    } else if (!isConnected) {
      setConnectionStatus('disconnected');
      setIsContractDeployed(false);
    }
  }, [isConnected, address, toast]);

  const generateXMRTId = (type: AssetType, details: AssetDetails) => {
    const prefix = ASSET_TYPES[type].xmrtPrefix;
    const timestamp = Date.now().toString(36);
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    return `${prefix}-${timestamp}-${randomSuffix}`;
  };

  const mintXMRTToken = async (tokenId: string, metadata: any) => {
    try {
      const tokenURI = `data:application/json;base64,${btoa(JSON.stringify(metadata))}`;
      const transaction = await mintNFTToCollection(tokenURI);
      return {
        tokenId,
        transaction: transaction.hash,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Error minting token:', error);
      throw error;
    }
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

  const handleContractDeployed = (type: AssetType) => {
    setIsContractDeployed(true);
    setSelectedType(type);
    setStep(2);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedType(null);
    setAssetDetails({});
    setLocation('');
    setVerificationStatus(null);
    setMintingStatus(null);
    setIsContractDeployed(false);
  };

  if (!isConnected || connectionStatus !== 'connected') {
    return (
      <WelcomeScreen
        onConnect={handleConnectWallet}
        connectionStatus={connectionStatus}
        connectedWallet={address || null}
      />
    );
  }

  if (connectionStatus === 'connected' && !isContractDeployed) {
    return <ContractInitializer onContractDeployed={handleContractDeployed} />;
  }

  return (
    <NFTDashboard 
      connectedWallet={address || null} 
      step={step}
      selectedType={selectedType}
      assetFields={selectedType ? ASSET_TYPES[selectedType].fields : []}
      onMint={handleMint}
    >
      {step === 3 && (
        <SuccessScreen
          selectedType={selectedType!}
          assetDetails={assetDetails}
          onReset={handleReset}
          generateXMRTId={generateXMRTId}
        />
      )}
    </NFTDashboard>
  );
};

export default XMRTAssetTokenizer;
