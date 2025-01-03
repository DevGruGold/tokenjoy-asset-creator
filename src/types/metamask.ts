export interface MetaMaskError {
  code: number;
  message: string;
}

export interface Web3Window extends Window {
  ethereum?: {
    isMetaMask?: boolean;
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    on: (event: string, callback: (params: any) => void) => void;
    removeListener: (event: string, callback: (params: any) => void) => void;
  };
}

declare global {
  interface Window extends Web3Window {}
}