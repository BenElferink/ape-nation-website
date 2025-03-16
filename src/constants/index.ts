export const ADA_SYMBOL = '₳'
export const ONE_MILLION = 1000000

export const API_KEYS = {
  BLOCKFROST_API_KEY: process.env.BLOCKFROST_API_KEY || '',
  IPFS_API_KEY: process.env.IPFS_API_KEY || '',

  BANGR_API_KEY: process.env.BANGR_API_KEY || '',

  FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
}

export const APE_NATION_POLICY_ID = '58b9f55e6ea9828dea7a8d9f49420171c6360f99b5e6e86de5fdb644'
export const JUNGLE_JUICE_POLICY_ID = 'a5c0b233312ff05cdd6271d5749992f77a8e568a0533855b250dc7a0'
export const MUTATION_NATION_POLICY_ID = '929ab04657f37d1108beb720a73f55f83b65948e05ec3a5619fa7875'
export const MUTATION_NATION_MEGA_MUTANTS_POLICY_ID = 'f8d619c4650033b4f3a4759805058c379ddc5d6b56102b948da5c162'
export const OG_CLUB_CARD_POLICY_ID = '21a44e25de32d0c2cba0413cb417fa61ed65cd9e2f419cf5c714ca4f'
export const ORDINAL_TOKENS_POLICY_ID = 'c9fa37158ded418a5bb18159e4e7d7c1aeadd202ef7eaa84fbf23350'
export const BLING_POLICY_ID = 'b0fd2efcb7e8b5d0dd6fce7403e31afc7919efe4e68a66570a5ee055'
export const IHOLD_MUSIC_POLICY_ID = 'a2e5d9747e27d18cbc03eb2c24222f79675f8c3adae33cf4de9ac2bc'
export const BLOODLINE_POLICY_ID = '563a59cf3372d66003022c87af460148d6d1cd87e5b177dbaa5863e0'

export const NATION_COIN_POLICY_ID = '38a2f68f5b009b1303b2e71ba3a374b7a2da11b5910423e2cf989948'
export const NATION_COIN_NAME_HEX = '4e4154494f4e'
export const NATION_COIN_TOKEN_ID = `${NATION_COIN_POLICY_ID}${NATION_COIN_NAME_HEX}`
export const NATION_COIN_DECIMALS = 0

export const LINKS = {
  X: 'https://x.com/Ape_NationNFT',
  DISCORD: 'https://discord.gg/mUQKg2NQtP',
  INSTAGRAM: 'https://www.instagram.com/apenationcnft',
  MERCH: 'https://nftouchable.com/collections/ape-nation',

  MUTATION_CHECKER: 'https://mutationchecker.yepple.io/apenation',
  MUTANTS_RAFFLES: 'https://labs.mutant-nft.com/projects/apenation?tab=raffles',
  MUTANTS_STAKING: 'https://labs.mutant-nft.com/projects/apenation?tab=staking',

  MAGIC_EDEN_ORDINALS: 'https://magiceden.io/ordinals/marketplace/ordinals-by-ape-nation',
  NATION_TOKENOMICS: 'https://usdnation-token-by-ape-nation.gitbook.io/usdnation-token-by-ape-nation',
  NATION_TAPTOOLS:
    'https://www.taptools.io/charts/token/f5808c2c990d86da54bfc97d89cee6efa20cd8461616359478d96b4c.f0e9e703b6b981d7740898bb023ef004976c988385fc8ecf173430a6c9ba7e51',
}

export const BLOODLINE_COLLATERAL_ADDRESS = 'addr1q8yh4nz600fqa5yqyt7nusqlq4cw65h4mcgufruf6gnjgzf34cqsunpd2hzxrz8glhlcwlce3rtxq4x7lvf3jcjmqgrqzynw52'
export const BLOODLINE_APP_WALLET_ADDRESS = 'addr1v8yh4nz600fqa5yqyt7nusqlq4cw65h4mcgufruf6gnjgzglekulq'
export const BLOODLINE_APP_WALLET_MNEMONIC = Array.isArray(process.env.BLOODLINE_MINT_WALLET_MNEMONIC)
  ? process.env.BLOODLINE_MINT_WALLET_MNEMONIC
  : process.env.BLOODLINE_MINT_WALLET_MNEMONIC?.split(',') || []

export const BLING_APP_WALLET_ADDRESS = 'addr1q8fnxq39gjpuxry3csfvme6g2y6m42f8ltpq9zxvhtdqrt8zwmaxtaukn3kzqhxp7dww66h2nyhjngju8yellheg59gs45fap3'
// BLING_APP_WALLET_MNEMONIC is fetched from DB (we lost access to Vercel)

export const TEAM_VAULT_WALLET_ADDRESS = 'addr1q8yclmvcyg5u3kfn9jaxlx7kldunlwmh8sf2kg0myxuznwtsqdak7kjtxqmcqhcj43fdayhwwqjj9xn2az5r8qhhajsq0vmqax'
export const TEAM_TREASURY_WALLET_ADDRESS = 'addr1qxygpl5awytuzdxrkqx8llq8htmaswhnpqd70u50d7phuzn6lymra9mz23tpxmg3r6v00xfh7qve5we4qx694vdg62gskv3eya'
export const DEV_WALLET_ADDRESS = 'addr1q9knw3lmvlpsvemjpgmkqkwtkzv8wueggf9aavvzyt2akpw7nsavexls6g59x007aucn2etqp2q4rd0929z2ukcn78fslm56p9'
