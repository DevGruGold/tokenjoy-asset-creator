import { ethers } from 'ethers';
import { TARGET_WALLET } from '@/config/constants';

// Basic ERC721 contract bytecode (this is a minimal implementation)
const ERC721_BYTECODE = "0x608060405234801561001057600080fd5b506040518060400160405280600d81526020016c584d525420436f6c6c656374696f6e60981b815250604051806040016040528060045b815250600090816200005f91906200014a565b5080600190816200007091906200014a565b505050620002166000526004601cfd5b634e487b7160e01b600052604160045260246000fd5b600181811c90821680620000aa57607f821691505b602082108103620000cb57634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156200014557600081815260208120601f850160051c81016020861015620001205750805b601f850160051c820191505b818110156200014157828155600101620001275b505050505050565b81516001600160401b03811115620001665762000166620000805b620001788160208501620000f4565b9392505050565b600082601f83011261019057600080fd5b620001a18383356020850162000178565b9392505050565b6001600160a01b038116811462000166576200016657600080fd5b600080604083850312156200020557600080fd5b82356001600160a01b03811681146200021d57600080fd5b9150602083013567ffffffffffffffff8111156200023957600080fd5b6200024785828601620001a1565b9150509250929050565b6001600160a01b0381168114620002665760006000fd5b50565b6000602082840312156200027b5760006000fd5b81356200028881620002505b939250505056fe";

const NFT_CONTRACT_ABI = [
  "function mint(address to, string memory tokenURI) public returns (uint256)",
  "function setCollectionParameters(address collectionAddress, string memory name, string memory symbol) public",
  "function transferFrom(address from, address to, uint256 tokenId) public",
  "function balanceOf(address owner) public view returns (uint256)",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "function name() public view returns (string memory)",
  "function symbol() public view returns (string memory)",
  "function tokenURI(uint256 tokenId) public view returns (string memory)"
];

let deployedContract: ethers.Contract | null = null;

export const initializeSmartContract = async (name: string, symbol: string) => {
  if (!window.ethereum) throw new Error("MetaMask is not installed");
  
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  
  // Deploy the collection contract
  const CollectionFactory = new ethers.ContractFactory(
    NFT_CONTRACT_ABI,
    ERC721_BYTECODE,
    signer
  );

  console.log("Deploying new ERC721 contract...");
  const collection = await CollectionFactory.deploy();
  console.log("Waiting for deployment...");
  await collection.deployed();
  console.log("Contract deployed at:", collection.address);

  // Set initial parameters
  console.log("Setting collection parameters...");
  await collection.setCollectionParameters(
    TARGET_WALLET,
    name,
    symbol
  );
  console.log("Collection parameters set");

  deployedContract = collection;
  return collection;
};

export const mintNFTToCollection = async (tokenURI: string) => {
  if (!deployedContract) {
    throw new Error("Contract not initialized");
  }
  console.log("Minting NFT with URI:", tokenURI);
  const tx = await deployedContract.mint(TARGET_WALLET, tokenURI);
  console.log("Waiting for transaction confirmation...");
  await tx.wait();
  console.log("NFT minted successfully:", tx.hash);
  return tx;
};

export const getCollectionInfo = async () => {
  if (!deployedContract) {
    throw new Error("Contract not initialized");
  }
  const name = await deployedContract.name();
  const symbol = await deployedContract.symbol();
  return { name, symbol, address: deployedContract.address };
};