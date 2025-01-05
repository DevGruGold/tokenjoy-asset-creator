import { configureChains, createConfig } from 'wagmi';
import { mainnet, polygon } from 'wagmi/chains';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';

export const projectId = 'b59c16c98b22d36a30ec986c5e28dde6';

const chains = [mainnet, polygon];

export const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient
});

export const ethereumClient = new EthereumClient(wagmiConfig, chains);