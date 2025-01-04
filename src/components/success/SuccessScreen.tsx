import React from 'react';
import { CheckCircle } from 'lucide-react';
import { TARGET_WALLET } from '@/config/constants';
import { AssetType, AssetDetails } from '@/types/xmrt';

interface SuccessScreenProps {
  selectedType: AssetType;
  assetDetails: AssetDetails;
  onReset: () => void;
  generateXMRTId: (type: AssetType, details: AssetDetails) => string;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({
  selectedType,
  assetDetails,
  onReset,
  generateXMRTId
}) => {
  return (
    <div className="text-center space-y-4">
      <CheckCircle className="mx-auto text-green-500 h-16 w-16" />
      <h2 className="text-2xl font-bold">Asset Successfully Tokenized!</h2>
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600 mb-2">Token ID:</p>
        <p className="font-mono text-blue-600">
          {generateXMRTId(selectedType, assetDetails)}
        </p>
      </div>
      <p className="text-gray-600">
        Your asset has been tokenized and linked to wallet:<br/>
        <span className="font-mono text-sm">{TARGET_WALLET}</span>
      </p>
      <button
        onClick={onReset}
        className="mt-4 w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Tokenize Another Asset
      </button>
    </div>
  );
};

export default SuccessScreen;