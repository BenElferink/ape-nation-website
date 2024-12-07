import type { NextApiRequest, NextApiResponse } from 'next'
import { BlockfrostProvider, deserializeAddress, ForgeScript, MeshWallet, NativeScript, Transaction } from '@meshsdk/core'
import { API_KEYS, BLOODLINE_APP_WALLET_MNEMONIC } from '@/src/constants'

export const config = {
  maxDuration: 300,
  api: {
    responseLimit: false,
  },
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, body } = req

  try {
    switch (method) {
      case 'POST': {
        const { tokenId } = body

        const _provider = new BlockfrostProvider(API_KEYS['BLOCKFROST_API_KEY'])
        const _wallet = new MeshWallet({
          networkId: 1,
          fetcher: _provider,
          submitter: _provider,
          key: {
            type: 'mnemonic',
            words: BLOODLINE_APP_WALLET_MNEMONIC,
          },
        })

        const _script = ForgeScript.withOneSignature(_wallet.addresses.enterpriseAddressBech32 as string)

        const _tx = new Transaction({ initiator: _wallet })
        _tx.burnAsset(_script, {
          unit: tokenId,
          quantity: '1',
        })

        const _unsigTx = await _tx.build()
        const _sigTx = await _wallet.signTx(_unsigTx)
        const _txHash = await _wallet.submitTx(_sigTx)

        return res.status(200).json({
          txHash: _txHash,
        })
      }

      default: {
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
