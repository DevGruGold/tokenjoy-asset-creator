export const connectMetaMask = async () => {
  try {
    // Check if we're on mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      return accounts[0];
    } else if (isMobile) {
      // Deep link to MetaMask
      const dappUrl = window.location.href;
      const metamaskAppDeepLink = `https://metamask.app.link/dapp/${dappUrl}`;
      window.location.href = metamaskAppDeepLink;
      throw new Error('Redirecting to MetaMask mobile app...');
    }
    throw new Error('MetaMask not found');
  } catch (error) {
    console.error('MetaMask connection error:', error);
    throw error;
  }
};