import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleInfo } from "lucide-react";

const ContractExplainer = () => {
  return (
    <Alert className="mb-6">
      <CircleInfo className="h-4 w-4" />
      <AlertTitle>Master Contract Deployment Required</AlertTitle>
      <AlertDescription className="mt-2 space-y-2">
        <p>
          Before minting NFTs, a master contract needs to be deployed to the blockchain. This is a one-time process that:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Creates the main NFT collection contract</li>
          <li>Sets up ownership and minting permissions</li>
          <li>Establishes metadata standards for your assets</li>
          <li>Enables future minting operations</li>
        </ul>
        <p className="text-sm text-muted-foreground mt-2">
          Once deployed, this contract will serve as the foundation for all future NFT mints in your collection.
        </p>
      </AlertDescription>
    </Alert>
  );
};

export default ContractExplainer;