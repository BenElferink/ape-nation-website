import type { NextApiRequest, NextApiResponse } from 'next'
import { Asset, BlockfrostProvider, MeshWallet, Transaction } from '@meshsdk/core'
import { blockfrost } from '@/utils/blockfrost'
import { API_KEYS, BLING_APP_WALLET_ADDRESS, BLING_POLICY_ID, DEV_WALLET_ADDRESS, ONE_MILLION, TEAM_TREASURY_WALLET_ADDRESS } from '@/constants'
import getEnv from '@/functions/storage/getEnv'
import formatHex from '@/functions/formatters/formatHex'
import { firestore } from '@/utils/firebase'

export const config = {
  maxDuration: 300,
  api: {
    responseLimit: false,
  },
}

export const getSenderFromBlingTx = async (txHash: string) => {
  const { inputs, outputs } = await blockfrost.txsUtxos(txHash)

  const received: Record<string, number> = {}

  inputs.forEach((inp) => {
    const from = inp.address

    outputs.forEach((outp) => {
      const to = outp.address

      // TODO: remove test value
      if (to !== from && [BLING_APP_WALLET_ADDRESS, TEAM_TREASURY_WALLET_ADDRESS, DEV_WALLET_ADDRESS].includes(to)) {
        outp.amount.forEach(({ unit, quantity }) => {
          if (unit === 'lovelace') {
            if (received[from]) {
              received[from] += +quantity
            } else {
              received[from] = +quantity
            }
          }
        })
      }
    })
  })

  const matched: {
    address: string
    lovelaces: number
  }[] = []

  Object.entries(received).forEach(([addr, num]) => {
    if ([49 * ONE_MILLION, 245 * ONE_MILLION].includes(num)) {
      matched.push({ address: addr, lovelaces: num })
    }
  })

  if (!matched.length) {
    throw new Error(`no matches found in TX ${txHash}`)
  } else if (matched.length > 1) {
    throw new Error(`too many matches found in TX ${txHash}`)
  }

  const match = matched[0]

  console.log('matched sender', match)

  return match
}

const getWalletAssets = async (wallet: MeshWallet) => {
  const utxos = await wallet.getUtxos()

  const assets: {
    RubyChain?: Asset[]
    TopazChain?: Asset[]
    EmeraldChain?: Asset[]
    SapphireChain?: Asset[]
    AmethystChain?: Asset[]
    NationNote?: Asset[]
  } = {}

  utxos.forEach(({ output }) => {
    if (output.address === wallet.addresses.baseAddressBech32) {
      output.amount.forEach(({ unit, quantity }) => {
        if (unit.indexOf(BLING_POLICY_ID) === 0) {
          const name = formatHex.fromHex(unit.replace(BLING_POLICY_ID, ''))
          const nameClean = name.replace(/[0-9]/g, '') as keyof typeof assets

          if (!assets[nameClean]) assets[nameClean] = []

          const idx = assets[nameClean].findIndex((t) => t.unit === unit)

          if (idx !== -1) {
            assets[nameClean][idx].quantity = String(+assets[nameClean][idx].quantity + +quantity)
          } else {
            assets[nameClean].push({ unit, quantity })
          }
        }
      })
    }
  })

  return assets
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, body } = req

  try {
    const mnemStr = (await getEnv('BLING_APP_WALLET_MNEMONIC'))?.value
    const mnemArr = Array.isArray(mnemStr) ? mnemStr : mnemStr?.split(',') || []

    const provider = new BlockfrostProvider(API_KEYS['BLOCKFROST_API_KEY'])
    const wallet = new MeshWallet({
      networkId: 1,
      fetcher: provider,
      submitter: provider,
      key: {
        type: 'mnemonic',
        words: mnemArr,
      },
    })

    switch (method) {
      case 'GET': {
        const assets = await getWalletAssets(wallet)

        return res.status(200).json(assets)
      }

      case 'POST': {
        const { txHash: txHashFromBody } = body

        const { address, lovelaces } = await getSenderFromBlingTx(txHashFromBody)
        const amount = lovelaces / ONE_MILLION / 49

        const collection = firestore.collection('bling-txs')
        const { empty } = await collection.where('txHash', '==', txHashFromBody).get()

        if (!empty) throw new Error('already processed this TX')

        const assets = await getWalletAssets(wallet)
        const assetsToSend: Asset[] = []

        const getSingleAsset = () => {
          const maxLen = Math.max(
            assets['RubyChain']?.length || 0,
            assets['TopazChain']?.length || 0,
            assets['EmeraldChain']?.length || 0,
            assets['SapphireChain']?.length || 0,
            assets['AmethystChain']?.length || 0
          )

          let token: Asset | undefined

          Object.entries(assets).forEach(([key, tokens]) => {
            if (!token && key !== 'NationNote' && tokens.length === maxLen) {
              token = tokens[0]
              assets[key as keyof typeof assets]?.shift()
            }
          })

          return token
        }

        if (amount === 5) {
          if (assets['RubyChain']?.length) assetsToSend.push(assets['RubyChain'].shift() as Asset)
          if (assets['TopazChain']?.length) assetsToSend.push(assets['TopazChain'].shift() as Asset)
          if (assets['EmeraldChain']?.length) assetsToSend.push(assets['EmeraldChain'].shift() as Asset)
          if (assets['SapphireChain']?.length) assetsToSend.push(assets['SapphireChain'].shift() as Asset)
          if (assets['AmethystChain']?.length) assetsToSend.push(assets['AmethystChain'].shift() as Asset)

          while (assetsToSend.length < 5) {
            const t = getSingleAsset()
            if (!t) throw new Error('not enough assets to cover this TX')
            assetsToSend.push(t)
          }
        } else {
          const t = getSingleAsset()
          if (!t) throw new Error('not enough assets to cover this TX')
          assetsToSend.push(t)
        }

        for (let i = 0; i < amount; i++) {
          const note = assets['NationNote']?.shift()
          if (!note) throw new Error('not enough notes to cover this TX')
          assetsToSend.push(note)
        }

        const tx = new Transaction({ initiator: wallet })
        tx.sendAssets({ address }, assetsToSend)

        const unsigTx = await tx.build()
        const sigTx = await wallet.signTx(unsigTx)
        const txHash = await wallet.submitTx(sigTx)

        await collection.add({ txHash: txHashFromBody, complete: true })

        return res.status(200).json({
          txHash,
        })
      }

      default: {
        res.setHeader('Allow', 'GET')
        res.setHeader('Allow', 'POST')
        return res.status(405).end()
      }
    }
  } catch (error) {
    console.error(error)
    return res.status(500).end()
  }
}

export default handler
