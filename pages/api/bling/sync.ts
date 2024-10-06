import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { blockfrost } from '@/utils/blockfrost'
import { BLING_APP_WALLET_ADDRESS } from '@/constants'
import { getSenderFromBlingTx } from '.'
import { firestore } from '@/utils/firebase'

const IS_DEV = process.env.NODE_ENV === 'development'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req

  try {
    switch (method) {
      case 'GET': {
        const collection = firestore.collection('bling-txs')
        const txs = await blockfrost.addressesTransactionsAll(BLING_APP_WALLET_ADDRESS)
        const now = Date.now()

        for await (const tx of txs) {
          let timestamp: string | number = String(tx.block_time)
          while (timestamp.length < 13) timestamp = `${timestamp}0`
          timestamp = Number(timestamp)

          if (now - timestamp < 3 * 60 * 60 * 1000) {
            const txHash = tx.tx_hash
            const { empty } = await collection.where('txHash', '==', txHash).get()

            try {
              if (
                empty &&
                ![
                  '89e924e2437e05b5480a6d23c6657600ea657b143435abc80e1c49cd4ccc69b6',
                  '29810d5f4e62d73786c6881063b2deda5d93c42eaa686d4bc04bb87b5fe799c6',
                ].includes(txHash)
              ) {
                await getSenderFromBlingTx(txHash)

                console.log('found faulty TX, retrying now', txHash)

                await axios.post(`${IS_DEV ? 'http://localhost:3000' : 'https://apenation.io'}/api/bling`, { txHash })
              }
            } catch (error: any) {
              if (IS_DEV) console.error(error?.message || error)
            }
          }
        }

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
