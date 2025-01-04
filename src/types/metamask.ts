export interface MetaMaskError {
  code: number;
  message: string;
}

export interface EthereumProvider {
  isMetaMask?: boolean;
  isRainbow?: boolean;
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, callback: (params: any) => void) => void;
  removeListener: (event: string, callback: (params: any) => void) => void;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
    rainbow?: any;
  }
}