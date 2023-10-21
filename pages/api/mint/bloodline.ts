import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { AppWallet, BlockfrostProvider, ForgeScript, Mint, Transaction } from '@meshsdk/core'
import { ipfs } from '@/utils/blockfrost'
import { storage } from '@/utils/firebase'
import badLabsApi from '@/utils/badLabsApi'
import formatHex from '@/functions/formatters/formatHex'
import getFileForPolicyId from '@/functions/getFileForPolicyId'
import type { PopulatedAsset } from '@/@types'
import { API_KEYS, APE_NATION_POLICY_ID, BLOODLINE_POLICY_ID, MUTATION_NATION_POLICY_ID, TEMP_WALLET } from '@/constants'

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

const getBufferFromUrl = async (url: string, body?: Record<string, any>) => {
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

    return Buffer.from(bin, 'binary')
  } catch (error: any) {
    console.error('Error fetching image:', error.message)
    throw error
  }
}

const generateImage = async (v0: PopulatedAsset, v1: PopulatedAsset, v2: PopulatedAsset) => {
  const fileName = `${v0.tokenName?.display.split('#')[1]}.png`
  let fileUrl = ''

  for await (const item of (await storage.ref('/bloodline').listAll()).items) {
    if (item.name === fileName) fileUrl = await item.getDownloadURL()
  }

  if (!fileUrl) {
    const v0_b64 = (await getBufferFromUrl(v0.image.ipfs.replace('ipfs://', 'https://ipfs.blockfrost.dev/ipfs/'))).toString('base64')
    const v1_b64 = (await getBufferFromUrl(v1.image.ipfs.replace('ipfs://', 'https://ipfs.blockfrost.dev/ipfs/'))).toString('base64')
    const v2_b64 = (await getBufferFromUrl(v2.image.ipfs.replace('ipfs://', 'https://ipfs.blockfrost.dev/ipfs/'))).toString('base64')

    const buff = await getBufferFromUrl(`https://labdev.bangr.io/api/v1/custom/collage3?apiKey=${API_KEYS['BANGR_API_KEY']}`, {
      v0_b64,
      v1_b64,
      v2_b64,
    })

    const snapshot = await storage.ref(`/bloodline/${fileName}`).put(new Uint8Array(buff), {
      contentType: 'image/png',
    })

    fileUrl = await snapshot.ref.getDownloadURL()
  }

  const buff = await getBufferFromUrl(fileUrl)
  const blob = new Blob([buff], { type: 'image/png' })
  const formData = new FormData()
  formData.append('file', blob)

  console.log('Uploading to IPFS')

  const {
    data: { ipfs_hash: ipfsHash, name },
  } = await axios.post<{ ipfs_hash: string; name: string; size: string }>(`https://ipfs.blockfrost.io/api/v0/ipfs/add`, formData, {
    headers: {
      project_id: API_KEYS['IPFS_API_KEY'],
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  })

  console.log('Successfully uploaded to IPFS:', name)
  console.log('Pinning in IPFS:', ipfsHash)

  const pinRes = await ipfs.pin(ipfsHash)

  console.log('Pin status in IPFS:', pinRes.state)

  return `ipfs://${ipfsHash}`
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, body } = req

  try {
    switch (method) {
      case 'POST': {
        const { txHash } = body

        const { addressOfSender, v0, v1, v2 } = await getTokensFromTx(txHash)

        const serialCode = v0.tokenName?.display.split('#')[1]
        const assetName = `Bloodline${serialCode}`

        try {
          const tokenId = `${BLOODLINE_POLICY_ID}${formatHex.toHex(assetName)}`
          const foundToken = await badLabsApi.token.getData(tokenId)

          if (!!foundToken) throw new Error('Already minted this!')
        } catch (error) {
          // Token not found: THIS IS OK!
        }

        const ipfsRef = await generateImage(v0, v1, v2)

        const mintPayload: Mint = {
          recipient: addressOfSender,
          label: '721',
          assetName,
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
              Club: v0.rarityRank ? (v0.rarityRank <= 1000 ? 'Canopy' : v0.rarityRank >= 1001 && v0.rarityRank <= 5000 ? 'Jungle' : 'TBA') : 'ERROR',
            },
          },
        }

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
