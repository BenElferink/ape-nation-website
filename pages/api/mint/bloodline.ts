import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import axios from 'axios'
import { AppWallet, BlockfrostProvider, ForgeScript, Mint, Transaction } from '@meshsdk/core'
import badLabsApi from '@/utils/badLabsApi'
import formatHex from '@/functions/formatters/formatHex'
import getFileForPolicyId from '@/functions/getFileForPolicyId'
import { API_KEYS, APE_NATION_POLICY_ID, BLOODLINE_POLICY_ID, MUTATION_NATION_POLICY_ID, TEMP_WALLET } from '@/constants'
import { PopulatedAsset } from '@/@types'
import { ipfs } from '@/utils/blockfrost'

export const config = {
  maxDuration: 300,
  api: {
    responseLimit: false,
  },
}

const SLOT = ''
const KEY_HASH = ''

const getTokensFromTx = async (txHash: string) => {
  const txData = await badLabsApi.transaction.getData(txHash, { withUtxos: true })

  if (!txData) {
    throw new Error('TX not submitted yet')
  }

  let selectedV0 = ''
  let selectedV1 = ''
  let selectedV2 = ''
  let addressOfSender = ''

  const ape = getFileForPolicyId(APE_NATION_POLICY_ID)
  const mutation = getFileForPolicyId(MUTATION_NATION_POLICY_ID)

  let thisV1 = undefined
  let thisV2 = undefined

  for (const { address, tokens } of txData.utxos || []) {
    for (const { tokenId } of tokens) {
      if (tokenId.indexOf(APE_NATION_POLICY_ID) == 0 && address.to === TEMP_WALLET) {
        selectedV0 = tokenId
        addressOfSender = address.from
      }

      if (tokenId.indexOf(MUTATION_NATION_POLICY_ID) == 0 && address.to === TEMP_WALLET) {
        const foundToken = mutation.assets.find((item) => item.tokenId === tokenId)

        if (foundToken) {
          if (foundToken.serialNumber?.toString().endsWith('1')) {
            selectedV1 = tokenId
            thisV1 = foundToken
          } else {
            selectedV2 = tokenId
            thisV2 = foundToken
          }
        }
      }
    }
  }

  const thisV0 = ape.assets.find((item) => item.tokenId === selectedV0)
  thisV1 = mutation.assets.find((item) => item.tokenId === selectedV1)
  thisV2 = mutation.assets.find((item) => item.tokenId === selectedV2)

  if (!thisV0 || !thisV1 || !thisV2) {
    throw new Error('Missing required asset(s) from TX')
  }

  const isTrio = thisV1.serialNumber === Number(`${thisV0.serialNumber}1`) && thisV2.serialNumber === Number(`${thisV0.serialNumber}2`)

  if (!isTrio) {
    throw new Error("Asset(s) from TX don't match")
  }

  return { addressOfSender, v0: thisV0, v1: thisV1, v2: thisV2 }
}

const getImageFromTokens = async (v0: PopulatedAsset, v1: PopulatedAsset, v2: PopulatedAsset) => {
  const getBase64FromUrl = async (url: string, body?: Record<string, any>) => {
    try {
      console.log('Fetching image from URL:', url)

      let bin = ''

      if (!!body) {
        const res = await axios.post(url, body, { responseType: 'arraybuffer' })
        bin = res.data
      } else {
        const res = await axios.get(url, { responseType: 'arraybuffer' })
        bin = res.data
      }

      console.log('Successfully fetched image')

      const buffer = Buffer.from(bin, 'binary')
      const base64String = buffer.toString('base64')

      return base64String
    } catch (error: any) {
      console.error('Error fetching image:', error.message)
      throw error
    }
  }

  const v0_b64 = await getBase64FromUrl(v0.image.ipfs.replace('ipfs://', 'https://ipfs.blockfrost.dev/ipfs/'))
  const v1_b64 = await getBase64FromUrl(v1.image.ipfs.replace('ipfs://', 'https://ipfs.blockfrost.dev/ipfs/'))
  const v2_b64 = await getBase64FromUrl(v2.image.ipfs.replace('ipfs://', 'https://ipfs.blockfrost.dev/ipfs/'))

  const b64 = await getBase64FromUrl(`https://labdev.bangr.io/api/v1/custom/collage3?apiKey=${API_KEYS['BANGR_API_KEY']}`, { v0_b64, v1_b64, v2_b64 })
  // NOTE : comes without "data:image/png;base64,"

  // const b64 = TEMP_IMAGE.split(',')[1]
  const buff = Buffer.from(b64, 'base64')
  const uint8Array = new Uint8Array(buff)

  const filePath = `${v0.tokenName?.display.split('#')[1]}.png`

  fs.appendFileSync(filePath, uint8Array)

  const { ipfs_hash: hash } = await ipfs.add(filePath)
  // await ipfs.pin(hash)

  fs.unlinkSync(filePath)

  return `ipfs://${hash}`
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, body } = req

  try {
    switch (method) {
      case 'POST': {
        const { txHash } = body

        const { addressOfSender, v0, v1, v2 } = await getTokensFromTx(txHash)
        const ipfsRef = await getImageFromTokens(v0, v1, v2)

        const serialCode = v0.tokenName?.display.split('#')[1]
        const mintPayload: Mint = {
          recipient: addressOfSender,
          label: '721',
          assetName: `Bloodline${serialCode}`,
          assetQuantity: '1',
          metadata: {
            project: 'Ape Nation',
            collection: 'Bloodline',
            name: `Bloodline #${serialCode}`,
            website: 'https://apenation.io',
            image: ipfsRef,
            mediaType: 'image/png',
            files: [
              {
                mediaType: 'image/png',
                name: `Bloodline #${serialCode}`,
                src: ipfsRef,
              },
              {
                mediaType: 'image/png',
                name: v0.tokenName?.display,
                src: v0.image.ipfs,
              },
              {
                mediaType: 'image/png',
                name: v1.tokenName?.display,
                src: v1.image.ipfs,
              },
              {
                mediaType: 'image/png',
                name: v2.tokenName?.display,
                src: v2.image.ipfs,
              },
            ],
            attributes: {
              // 'Fox (F)': thisFemale?.tokenName?.display,
              // 'Fox (M)': thisMale?.tokenName?.display,
              // Motorcycle: thisBike?.tokenName?.display,
            },
          },
        }

        // try {
        //   const tokenId = `${BLOODLINE_POLICY_ID}${formatHex.toHex(mintPayload.assetName)}`
        //   const foundToken = await badLabsApi.token.getData(tokenId)

        //   if (!!foundToken) {
        //     throw new Error('Already minted this!')
        //   }
        // } catch (error) {
        //   // Token not found:
        //   // THIS IS OK!
        // }

        // const blockchainProvider = new BlockfrostProvider(API_KEYS['BLOCKFROST_API_KEY'])

        // const _wallet = new AppWallet({
        //   networkId: 1,
        //   fetcher: blockchainProvider,
        //   submitter: blockchainProvider,
        //   key: {
        //     type: 'cli',
        //     payment: BLOODLINE_SIGNING_KEY,
        //   },
        // })

        // const _script = ForgeScript.fromNativeScript({
        //   type: 'all',
        //   scripts: [
        //     { type: 'before', slot: SLOT },
        //     { type: 'sig', keyHash: KEY_HASH },
        //   ],
        // })

        // const _tx = new Transaction({ initiator: _wallet })

        // _tx.setTimeToExpire(SLOT)
        // _tx.mintAsset(_script, mintPayload)

        // const _unsigTx = await _tx.build()
        // const _sigTx = await _wallet.signTx(_unsigTx)
        // const _txHash = await _wallet.submitTx(_sigTx)

        return res.status(200).json({
          // txHash: _txHash,
          mintPayload,
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
