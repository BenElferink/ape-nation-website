import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { blockfrost } from '@/utils/blockfrost'
import formatHex from '@/functions/formatters/formatHex'
import { APE_NATION_POLICY_ID, BLOODLINE_POLICY_ID, BLOODLINE_VAULT_WALLET_ADDRESS } from '@/constants'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req

  try {
    switch (method) {
      case 'GET': {
        const utxos = await blockfrost.addressesUtxosAll(BLOODLINE_VAULT_WALLET_ADDRESS)

        const toCheck: {
          txHash: string
          keyId: string
        }[] = []

        utxos.forEach((utxo) => {
          utxo.amount.forEach((amount) => {
            if (amount.unit.indexOf(APE_NATION_POLICY_ID) === 0) {
              const ogNum = Number(formatHex.fromHex(amount.unit.replace(APE_NATION_POLICY_ID, '')).replace('ApeNation', ''))
              const assetName = `${formatHex.toHex(
                `Bloodline${ogNum < 10 ? `000${ogNum}` : ogNum < 100 ? `00${ogNum}` : ogNum < 1000 ? `0${ogNum}` : `${ogNum}`}`
              )}`

              toCheck.push({
                txHash: utxo.tx_hash,
                keyId: `${BLOODLINE_POLICY_ID}${assetName}`,
              })
            }
          })
        })

        const txHashes: string[] = []

        for await (const { keyId, txHash } of toCheck) {
          try {
            const token = await blockfrost.assetsById(keyId)

            console.log('asset already minted', token.fingerprint)
          } catch (error) {
            console.log('asset not minted', keyId)

            const badTxs = [
              'b2d57f2c135af6b8fd3e968372c8c83bfce19ebf851c87636230b55b24175e85',
              '7bd11309b39d2715038737f469bf7a519c731d3b7a58a401e46ec081958a99c7',
              '7bd11309b39d2715038737f469bf7a519c731d3b7a58a401e46ec081958a99c7',
            ]

            if (!badTxs.includes(txHash)) txHashes.push(txHash)
          }
        }

        if (txHashes.length) {
          console.log(`found ${txHashes.length} faulty TXs, retrying now`)

          for await (const txHash of txHashes) await axios.post('https://apenation.io/api/mint/bloodline', { txHash })
        }

        console.log('done')

        return res.status(204).end()
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
