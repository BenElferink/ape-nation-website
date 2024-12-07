import { API_KEYS } from '@/src/constants';
import { BlockFrostAPI, BlockFrostIPFS } from '@blockfrost/blockfrost-js';

const blockfrost = new BlockFrostAPI({
  projectId: API_KEYS['BLOCKFROST_API_KEY'],
  network: 'mainnet',
});

const ipfs = new BlockFrostIPFS({
  projectId: API_KEYS['IPFS_API_KEY'],
});

export { blockfrost, ipfs };
