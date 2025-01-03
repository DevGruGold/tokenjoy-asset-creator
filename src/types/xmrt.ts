export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export type AssetType = 'VEHICLE' | 'REAL_ESTATE' | 'ART' | 'COLLECTIBLE';

export interface AssetTypeConfig {
  icon: string;
  fields: string[];
  chain: {
    CA?: string;
    default: string;
  };
  xmrtPrefix: string;
}

export interface AssetDetails {
  [key: string]: string;
}