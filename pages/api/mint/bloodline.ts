import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { AppWallet, BlockfrostProvider, ForgeScript, Mint, Transaction } from '@meshsdk/core'
import { storage } from '@/utils/firebase'
import badLabsApi from '@/utils/badLabsApi'
import getEnv from '@/functions/storage/getEnv'
import formatHex from '@/functions/formatters/formatHex'
import getFileForPolicyId from '@/functions/getFileForPolicyId'
import type { PopulatedAsset } from '@/@types'
import {
  API_KEYS,
  APE_NATION_POLICY_ID,
  BLOODLINE_POLICY_ID,
  MUTATION_NATION_POLICY_ID,
  BLOODLINE_VAULT_WALLET_ADDRESS,
  BLOODLINE_MINT_WALLET_MNEMONIC,
} from '@/constants'

export const config = {
  maxDuration: 300,
  api: {
    responseLimit: false,
  },
}

let PINATA_API_KEY = ''

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
      if (tokenId.indexOf(APE_NATION_POLICY_ID) == 0 && address.to === BLOODLINE_VAULT_WALLET_ADDRESS) {
        selectedV0 = tokenId
        addressOfSender = address.from
      }

      if (tokenId.indexOf(MUTATION_NATION_POLICY_ID) == 0 && address.to === BLOODLINE_VAULT_WALLET_ADDRESS) {
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

const getBase64FromIpfs = async (ipfsRef: string) => {
  const url = ipfsRef.replace('ipfs://', 'https://ipfs.blockfrost.io/api/v0/ipfs/gateway/')

  try {
    console.log('Fetching image from URL:', url)

    const res = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: {
        project_id: API_KEYS['IPFS_API_KEY'],
      },
    })

    console.log('Successfully fetched image')

    return Buffer.from(res.data).toString('base64')
  } catch (error: any) {
    console.error('Error fetching image:', error.message)
    throw error
  }
}

const generateImage = async (v0: PopulatedAsset, v1: PopulatedAsset, v2: PopulatedAsset, club: string) => {
  if (!PINATA_API_KEY) PINATA_API_KEY = (await getEnv('PINATA_API_KEY'))?.value || ''

  const fileName = `${v0.tokenName?.display.split('#')[1]}.png`
  let fileUrl = ''

  for await (const item of (await storage.ref('/bloodline').listAll()).items) {
    if (item.name === fileName) fileUrl = await item.getDownloadURL()
  }

  if (!fileUrl) {
    const v0_b64 = await getBase64FromIpfs(v0.image.ipfs)
    const v1_b64 = await getBase64FromIpfs(v1.image.ipfs)
    const v2_b64 = await getBase64FromIpfs(v2.image.ipfs)

    const buff = await getBufferFromUrl(`https://lab.bangr.io/api/v1/custom/collage3?apiKey=${API_KEYS['BANGR_API_KEY']}`, {
      pfp_v0_b64: v0_b64,
      pfp_v1_b64: v1_b64,
      pfp_v2_b64: v2_b64,
      pfp_v0_name: v0.tokenName?.display,
      pfp_v1_name: v1.tokenName?.display,
      pfp_v2_name: v2.tokenName?.display,
      rank: v0.rarityRank?.toString(),
      overlay: club.toLowerCase().replaceAll(' ', ''),
    })

    console.log('Uploading to Firebase')

    const snapshot = await storage.ref(`/bloodline/${fileName}`).put(new Uint8Array(buff), {
      contentType: 'image/png',
    })

    console.log('Successfully uploaded to Firebase')

    fileUrl = await snapshot.ref.getDownloadURL()
  }

  const formData = new FormData()
  const buff = await getBufferFromUrl(fileUrl)

  formData.append('file', new Blob([buff], { type: 'image/png' }))
  formData.append('pinataMetadata', JSON.stringify({ name: fileName }))

  console.log('Uploading to IPFS')

  const {
    data: { IpfsHash: ipfsHash },
  } = await axios.post<{
    IpfsHash: string
    PinSize: number
    Timestamp: string // ISO date
    isDuplicate: boolean
  }>('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
    headers: {
      Authorization: `Bearer ${PINATA_API_KEY}`,
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  })

  console.log('Successfully uploaded to IPFS:', ipfsHash)

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
        const club = v0.rarityRank
          ? v0.rarityRank <= 1000
            ? 'Canopy Club'
            : v0.rarityRank >= 1001 && v0.rarityRank <= 5000
            ? 'Jungle Club'
            : 'Congo Club'
          : 'ERROR'

        if (club === 'ERROR') throw Error('no rank, no club, impossible')

        try {
          const tokenId = `${BLOODLINE_POLICY_ID}${formatHex.toHex(assetName)}`
          const foundToken = await badLabsApi.token.getData(tokenId)

          if (!!foundToken) throw new Error('Already minted this!')
        } catch (error) {
          // Token not found: THIS IS OK!
        }

        const ipfsRef = await generateImage(v0, v1, v2, club)
        const attributes: Record<string, string> = {}

        Object.entries(v0.attributes).forEach(([key, val]) => {
          if (key === 'Normal Shades') {
            attributes['Glasses'] = val
          } else {
            attributes[key] = val
          }
        })

        const mintPayload: Mint = {
          label: '721',
          assetQuantity: '1',
          recipient: addressOfSender,
          assetName,
          metadata: {
            project: 'Ape Nation',
            collection: 'Bloodline',
            name: `Bloodline #${serialCode}`,
            website: 'https://apenation.io',
            image: ipfsRef.length > 64 ? [ipfsRef.substring(0, 64), ipfsRef.substring(64)] : ipfsRef,
            mediaType: 'image/png',
            files: [
              {
                mediaType: 'image/png',
                name: `Bloodline #${serialCode}`,
                src: ipfsRef.length > 64 ? [ipfsRef.substring(0, 64), ipfsRef.substring(64)] : ipfsRef,
              },
              {
                mediaType: 'image/png',
                name: v0.tokenName?.display,
                src: v0.image.ipfs.length > 64 ? [v0.image.ipfs.substring(0, 64), v0.image.ipfs.substring(64)] : v0.image.ipfs,
              },
              {
                mediaType: 'image/png',
                name: v1.tokenName?.display,
                src: v1.image.ipfs.length > 64 ? [v1.image.ipfs.substring(0, 64), v1.image.ipfs.substring(64)] : v1.image.ipfs,
              },
              {
                mediaType: 'image/png',
                name: v2.tokenName?.display,
                src: v2.image.ipfs.length > 64 ? [v2.image.ipfs.substring(0, 64), v2.image.ipfs.substring(64)] : v2.image.ipfs,
              },
            ],

            Rank: v0.rarityRank,
            Bloodline: club,
            ...attributes,
          },
        }

        const _provider = new BlockfrostProvider(API_KEYS['BLOCKFROST_API_KEY'])
        const _wallet = new AppWallet({
          networkId: 1,
          fetcher: _provider,
          submitter: _provider,
          key: {
            type: 'mnemonic',
            words: BLOODLINE_MINT_WALLET_MNEMONIC,
          },
        })

        const _address = _wallet.getPaymentAddress()
        const _script = ForgeScript.withOneSignature(_address)

        const _tx = new Transaction({ initiator: _wallet })
        _tx.mintAsset(_script, mintPayload)

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
