import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ASSET_TYPES } from '@/config/constants';
import { AssetType } from '@/types/xmrt';
import { initializeSmartContract } from '@/utils/smartContract';
import ContractExplainer from './ContractExplainer';

interface ContractInitializerProps {
  onContractDeployed: (contractType: AssetType) => void;
}

const ContractInitializer: React.FC<ContractInitializerProps> = ({ onContractDeployed }) => {
  const { toast } = useToast();
  const [contractName, setContractName] = useState('');
  const [contractSymbol, setContractSymbol] = useState('');
  const [selectedType, setSelectedType] = useState<AssetType | ''>('');
  const [isDeploying, setIsDeploying] = useState(false);

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) {
      toast({
        title: "Error",
        description: "Please select an asset type",
        variant: "destructive",
      });
      return;
    }

    setIsDeploying(true);
    try {
      await initializeSmartContract(contractName, contractSymbol);
      toast({
        title: "Success",
        description: "Smart contract deployed successfully",
      });
      onContractDeployed(selectedType);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to deploy smart contract. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Initialize Smart Contract</h2>
      <ContractExplainer />
      <form onSubmit={handleDeploy} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="contractType">Asset Type</Label>
          <Select
            value={selectedType}
            onValueChange={(value) => setSelectedType(value as AssetType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select asset type" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(ASSET_TYPES).map(([type, config]) => (
                <SelectItem key={type} value={type}>
                  <span className="flex items-center">
                    <span className="mr-2">{config.icon}</span>
                    {type.replace('_', ' ')}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contractName">Collection Name</Label>
          <Input
            id="contractName"
            value={contractName}
            onChange={(e) => setContractName(e.target.value)}
            placeholder="e.g., My Real Estate Collection"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contractSymbol">Collection Symbol</Label>
          <Input
            id="contractSymbol"
            value={contractSymbol}
            onChange={(e) => setContractSymbol(e.target.value)}
            placeholder="e.g., MRE"
            required
            maxLength={5}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isDeploying}
        >
          {isDeploying ? 'Deploying Contract...' : 'Deploy Smart Contract'}
        </Button>
      </form>
    </div>
  );
};

export default ContractInitializer;