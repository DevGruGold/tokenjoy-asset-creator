import React from 'react';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import NFTMintingForm from '../nft/NFTMintingForm';
import { AssetType } from '@/types/xmrt';

interface NFTDashboardProps {
  connectedWallet: string | null;
  step: number;
  children: React.ReactNode;
  selectedType?: AssetType | null;
  assetFields?: string[];
  onMint?: (metadata: any) => Promise<void>;
}

const NFTDashboard: React.FC<NFTDashboardProps> = ({ 
  connectedWallet, 
  step, 
  children,
  selectedType,
  assetFields = [],
  onMint = async () => {},
}) => {
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        {!connectedWallet && step > 1 && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>MetaMask Connection Required</AlertTitle>
            <AlertDescription>
              Please connect your MetaMask wallet to continue with the tokenization process.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between mb-8">
          {[1, 2, 3].map((stepNum) => (
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
          {step === 2 && selectedType && (
            <NFTMintingForm
              assetType={selectedType}
              assetFields={assetFields}
              onMint={onMint}
            />
          )}
          {step !== 2 && children}
        </div>
      </div>
    </div>
  );
};

export default NFTDashboard;