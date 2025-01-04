import { ethers } from 'ethers';
import { TARGET_WALLET } from '@/config/constants';

const NFT_CONTRACT_ABI = [
  "function mint(address to, string memory tokenURI) public returns (uint256)",
  "function setCollectionParameters(address collectionAddress, string memory name, string memory symbol) public",
  "function transferFrom(address from, address to, uint256 tokenId) public",
];

export const initializeSmartContract = async () => {
  if (!window.ethereum) throw new Error("MetaMask is not installed");
  
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  
  // Deploy the collection contract
  const CollectionFactory = new ethers.ContractFactory(
    NFT_CONTRACT_ABI,
    // Basic ERC721 bytecode
    "0x...", // You'll need to replace this with actual bytecode
    signer
  );

  const collection = await CollectionFactory.deploy();
  await collection.deployed();

  // Set initial parameters
  await collection.setCollectionParameters(
    TARGET_WALLET,
    "XMRT Collection",
    "XMRT"
  );

  return collection;
};

export const mintNFTToCollection = async (tokenURI: string) => {
  const contract = await initializeSmartContract();
  const tx = await contract.mint(TARGET_WALLET, tokenURI);
  await tx.wait();
  return tx;
};