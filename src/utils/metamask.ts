export const connectMetaMask = async () => {
  try {
    // Check if we're on mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (typeof window.ethereum !== 'undefined') {
      // Check if Rainbow Wallet is available
      const isRainbow = window.ethereum.isRainbow;
      
      if (isMobile && !window.ethereum.isMetaMask && !isRainbow) {
        // Try to deep link to Rainbow first on mobile if neither MetaMask nor Rainbow is installed
        const dappUrl = window.location.href;
        if ('rainbow' in window) {
          window.location.href = `rainbow://dapp?url=${encodeURIComponent(dappUrl)}`;
        } else {
          // Fall back to MetaMask if Rainbow isn't available
          const metamaskAppDeepLink = `https://metamask.app.link/dapp/${dappUrl}`;
          window.location.href = metamaskAppDeepLink;
        }
        throw new Error('Redirecting to wallet...');
      }

      console.log('Connecting to wallet...');
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Log which wallet we connected to
      if (isRainbow) {
        console.log('Connected via Rainbow Wallet');
      } else if (window.ethereum.isMetaMask) {
        console.log('Connected via MetaMask');
      }
      
      return accounts[0];
    }
    throw new Error('No Web3 wallet found');
  } catch (error) {
    console.error('Wallet connection error:', error);
    throw error;
  }
};

// Add type definition for Rainbow Wallet
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      isRainbow?: boolean;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (params: any) => void) => void;
      removeListener: (event: string, callback: (params: any) => void) => void;
    };
    rainbow?: any;
  }
}