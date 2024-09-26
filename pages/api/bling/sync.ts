import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { blockfrost } from '@/utils/blockfrost'
import { BLING_APP_WALLET_ADDRESS } from '@/constants'
import { getSenderFromBlingTx } from '.'
import { firestore } from '@/utils/firebase'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req

  try {
    switch (method) {
      case 'GET': {
        const txs = await blockfrost.addressesTransactionsAll(BLING_APP_WALLET_ADDRESS)
        const now = Date.now()

        for await (const tx of txs) {
          let timestamp: string | number = String(tx.block_time)
          while (timestamp.length < 13) timestamp = `${timestamp}0`
          timestamp = Number(timestamp)

          if (now - timestamp < 2 * 60 * 60 * 1000) {
            try {
              const txHash = tx.tx_hash

              await getSenderFromBlingTx(txHash)

              const collection = firestore.collection('bling-txs')
              const { empty } = await collection.where('txHash', '==', txHash).get()

              if (empty && txHash !== '89e924e2437e05b5480a6d23c6657600ea657b143435abc80e1c49cd4ccc69b6') {
                console.log('found faulty TX, retrying now', txHash)

                await axios.post('https://apenation.io/api/bling', { txHash })
              }
            } catch (error) {}
          }
        }

        console.log('done')

        return res.status(204).end()
      }

      default: {
        res.setHeader('Allow', 'GET')
        return res.status(405).end()
      }
    }
  } catch (error) {
    console.error(error)
    return res.status(500).end()
  }
}

export default handler
