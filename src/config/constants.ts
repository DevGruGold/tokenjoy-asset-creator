export const CHAIN_ID = '0x1'; // Ethereum Mainnet
export const TARGET_WALLET = '0xae2402dfdd313b8c40af06d3292b50de1ed75f68';
export const NETWORK_NAME = 'Ethereum Main Network';

export const ASSET_TYPES = {
  VEHICLE: {
    icon: '🚗',
    fields: ['VIN', 'Make', 'Model', 'Year', 'Color', 'Mileage'],
    chain: {
      CA: 'avalanche',
      default: 'ethereum'
    },
    xmrtPrefix: 'XMRT-VEH'
  },
  REAL_ESTATE: {
    icon: '🏠',
    fields: ['Address', 'Parcel Number', 'Square Footage', 'Year Built', 'Property Type'],
    chain: {
      CA: 'avalanche',
      default: 'ethereum'
    },
    xmrtPrefix: 'XMRT-RE'
  },
  ART: {
    icon: '🎨',
    fields: ['Title', 'Artist', 'Medium', 'Year Created', 'Dimensions'],
    chain: {
      default: 'ethereum'
    },
    xmrtPrefix: 'XMRT-ART'
  },
  COLLECTIBLE: {
    icon: '💎',
    fields: ['Name', 'Category', 'Condition', 'Year', 'Serial Number'],
    chain: {
      default: 'ethereum'
    },
    xmrtPrefix: 'XMRT-COL'
  }
};
