export interface WalletProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, callback: (params: any) => void) => void;
  removeListener: (event: string, callback: (params: any) => void) => void;
  isMetaMask?: boolean;
}

declare global {
  interface Window {
    ethereum?: WalletProvider;
  }
}