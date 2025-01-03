import React from 'react';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface NFTDashboardProps {
  connectedWallet: string | null;
  step: number;
  children: React.ReactNode;
}

const NFTDashboard: React.FC<NFTDashboardProps> = ({ connectedWallet, step, children }) => {
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
          {children}
        </div>
      </div>
    </div>
  );
};

export default NFTDashboard;