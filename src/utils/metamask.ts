import { getAccount } from '@wagmi/core';

export const connectMetaMask = async () => {
  try {
    const account = await getAccount();
    return account.address;
  } catch (error) {
    console.error('Wallet connection error:', error);
    throw error;
  }
};