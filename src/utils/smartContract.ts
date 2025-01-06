import { ethers } from 'ethers';

const MASTER_CONTRACT_ABI = [
  "function initialize(string memory name, string memory symbol) public",
  "function mint(address to, string memory uri) public returns (uint256)",
  "function setBaseURI(string memory baseURI) public",
  "function tokenURI(uint256 tokenId) public view returns (string memory)",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "function balanceOf(address owner) public view returns (uint256)",
  "function transferFrom(address from, address to, uint256 tokenId) public"
];

const MASTER_CONTRACT_BYTECODE = `0x608060405234801561001057600080fd5b506040518060400160405280600d81526020016c584d525420436f6c6c656374696f6e60981b815250604051806040016040528060045b815250600090816200005f91906200014a565b5080600190816200007091906200014a565b505050620002166000526004601cfd5b634e487b7160e01b600052604160045260246000fd5b600181811c90821680620000aa57607f821691505b602082108103620000cb57634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156200014557600081815260208120601f850160051c81016020861015620001205750805b601f850160051c820191505b818110156200014157828155600101620001275b505050505050565b81516001600160401b03811115620001665762000166620000805b620001788160208501620000f4565b9392505050565b600082601f83011261019057600080fd5b620001a18383356020850162000178565b9392505050565b6001600160a01b038116811462000166576200016657600080fd5b600080604083850312156200020557600080fd5b82356001600160a01b03811681146200021d57600080fd5b9150602083013567ffffffffffffffff8111156200023957600080fd5b6200024785828601620001a1565b9150509250929050565b6001600160a01b0381168114620002665760006000fd5b50565b6000602082840312156200027b5760006000fd5b81356200028881620002505b939250505056fe`;

export const initializeSmartContract = async (name: string, symbol: string) => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    // Deploy the master contract
    const factory = new ethers.ContractFactory(
      MASTER_CONTRACT_ABI,
      MASTER_CONTRACT_BYTECODE,
      signer
    );

    console.log("Deploying master contract...");
    const contract = await factory.deploy();
    await contract.deployed();
    console.log("Master contract deployed at:", contract.address);

    // Initialize the contract with name and symbol
    const tx = await contract.initialize(name, symbol);
    await tx.wait();
    console.log("Contract initialized with name and symbol");

    return contract.address;
  } catch (error) {
    console.error("Error deploying master contract:", error);
    throw error;
  }
};

export const mintNFTToCollection = async (tokenURI: string) => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();

    // For this example, we're using the last deployed contract
    // In a production environment, you'd want to store and retrieve the contract address
    const contract = new ethers.Contract(
      localStorage.getItem('lastDeployedContract') || '',
      MASTER_CONTRACT_ABI,
      signer
    );

    const tx = await contract.mint(address, tokenURI);
    const receipt = await tx.wait();
    
    return receipt;
  } catch (error) {
    console.error("Error minting NFT:", error);
    throw error;
  }
};