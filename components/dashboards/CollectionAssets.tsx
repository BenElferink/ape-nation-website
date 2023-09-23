'use client'
import Image from 'next/image'
import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { MusicalNoteIcon } from '@heroicons/react/24/solid'
import useWallet from '@/contexts/WalletContext'
import badLabsApi from '@/utils/badLabsApi'
import getFileForPolicyId from '@/functions/getFileForPolicyId'
import formatIpfsUrl from '@/functions/formatters/formatIpfsUrl'
import AssetFilters from '../filters/AssetFilters'
import AssetCard from '../cards/AssetCard'
import CopyChip from '../CopyChip'
import Loader from '../Loader'
import Modal from '../layout/Modal'
import ImageLoader from '../Loader/ImageLoader'
import MusicPlayerWaves from '../MusicPlayerWaves'
import type { PolicyId, PopulatedAsset, PopulatedTrait } from '@/@types'
import { ADA_SYMBOL, APE_NATION_POLICY_ID, IHOLD_MUSIC_POLICY_ID } from '@/constants'

interface AssetModalContentProps {
  policyId: string
  asset: PopulatedAsset
  withWallet: boolean
}

const AssetModalContent = (props: AssetModalContentProps) => {
  const { policyId, asset, withWallet } = props

  const [boughtAtPrice, setBoughtAtPrice] = useState(0)
  const [displayedFile, setDisplayedFile] = useState<PopulatedAsset['files'][0]>(
    asset.files.length
      ? asset.policyId === IHOLD_MUSIC_POLICY_ID
        ? asset.files.filter((x) => x.mediaType === 'audio/mp3')[0]
        : asset.files[0]
      : {
          name: asset?.tokenName?.display as string,
          mediaType: 'image/png',
          src: asset.image.url,
        }
  )

  useEffect(() => {
    if (withWallet) {
      const stored = localStorage.getItem(`asset-price-${asset.tokenId}`)
      const storedPrice = stored ? JSON.parse(stored) : 0
      const storedPriceNum = Number(storedPrice)

      if (storedPrice && !isNaN(storedPriceNum)) {
        setBoughtAtPrice(storedPriceNum)
      } else {
        badLabsApi.token.market.getActivity(asset.tokenId).then((data) => {
          const price = data.items.filter(({ activityType }) => activityType === 'BUY')[0]?.price || 0
          setBoughtAtPrice(price)
        })
      }
    }
  }, [policyId, asset, withWallet])

  return (
    <div className='flex flex-col lg:flex-row lg:justify-between md:px-6'>
      <div>
        {displayedFile.mediaType === 'image/png' ? (
          <button onClick={() => window.open(formatIpfsUrl(displayedFile.src), '_blank', 'noopener noreferrer')} className='w-[80vw] md:w-[555px]'>
            <ImageLoader
              src={formatIpfsUrl(displayedFile.src)}
              alt={displayedFile.name}
              width={1000}
              height={1000}
              loaderSize={150}
              style={{ borderRadius: '1rem' }}
            />
          </button>
        ) : displayedFile.mediaType === 'video/mp4' ? (
          <button onClick={() => {}} className='w-[80vw] md:w-[555px]'>
            <video
              src={formatIpfsUrl(displayedFile.src)}
              controls
              autoPlay
              loop
              muted
              playsInline
              width={1000}
              height={1000}
              style={{ borderRadius: '1rem' }}
            />
          </button>
        ) : displayedFile.mediaType === 'audio/mp3' ? (
          <button onClick={() => {}} className='w-[80vw] md:w-[555px]'>
            <MusicPlayerWaves src={formatIpfsUrl(displayedFile.src)} w='w-[80vw] md:w-[555px]' h='h-[80vw] md:h-[555px]' />
          </button>
        ) : (
          <button onClick={() => {}} className='w-[80vw] md:w-[555px]'>
            <div className='w-[100%] h-[80vw] md:w-[555px] md:h-[555px] flex items-center justify-center bg-gray-900 bg-opacity-50 rounded-2xl border border-gray-700'>
              Unhandled file type:
              <br />
              {displayedFile.mediaType}
            </div>
          </button>
        )}

        <div className='w-[80vw] md:w-[555px] flex flex-wrap items-center'>
          {(asset.files.length
            ? asset.policyId === IHOLD_MUSIC_POLICY_ID
              ? asset.files.filter((x) => x.mediaType === 'audio/mp3')
              : asset.files
            : [displayedFile]
          ).map((file) => (
            <button
              key={`file-${file.src}`}
              onClick={() => setDisplayedFile(file)}
              className='w-32 h-32 m-1 flex items-center justify-center text-xs rounded-2xl border border-gray-700 bg-gray-900/50'
            >
              {file.mediaType === 'image/png' ? (
                <ImageLoader src={formatIpfsUrl(file.src)} alt={file.name} width={150} height={150} style={{ borderRadius: '1rem' }} />
              ) : file.mediaType === 'video/mp4' ? (
                <video src={formatIpfsUrl(file.src)} playsInline width={150} height={150} style={{ borderRadius: '1rem' }} />
              ) : file.mediaType === 'audio/mp3' ? (
                <MusicalNoteIcon className='w-24 h-24' />
              ) : (
                <Fragment>
                  Unhandled file type:
                  <br />
                  {file.mediaType}
                </Fragment>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className='mt-2 lg:mt-0 lg:ml-6'>
        <div className='my-1'>
          <CopyChip prefix='Policy ID' value={policyId} />
        </div>
        <div className='my-1'>
          <CopyChip prefix='Asset ID' value={asset.tokenId} />
        </div>

        {withWallet ? (
          <div className='mt-1 flex items-center'>
            <p className='mx-2 whitespace-nowrap'>Bought for:</p>
            <input
              value={boughtAtPrice}
              onChange={(e) => {
                const val = Number(e.target.value)

                if (!isNaN(val)) {
                  localStorage.setItem(`asset-price-${asset.tokenId}`, String(val))
                  setBoughtAtPrice(val)
                }
              }}
              className='w-full p-3 rounded-lg bg-gray-900 border border-gray-700 text-sm hover:bg-gray-700 hover:border-gray-500 hover:text-white'
            />
          </div>
        ) : null}

        <table className='mx-2 my-4 border-collapse'>
          <thead>
            <tr>
              <th className='pr-2 text-xs text-start truncate'>Trait Category</th>
              <th className='pl-2 text-xs text-start truncate'>Trait Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(asset.attributes).map(([category, trait]) => (
              <tr key={`attribute-${category}-${trait}`}>
                <td className='pr-2 text-xs text-start truncate'>{category}</td>
                <td className='pl-2 text-xs text-start truncate'>{trait}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {!asset.isBurned ? (
          <Fragment>
            <button
              onClick={() => window.open(`https://pool.pm/${asset.fingerprint}`, '_blank', 'noopener noreferrer')}
              className='w-full my-1 py-2 px-4 flex items-center justify-start bg-gray-700 border border-gray-600 rounded hover:bg-gray-500 hover:border-gray-400 hover:text-gray-200'
            >
              <Image unoptimized src='/media/logo/other/poolpm.png' alt='' width={30} height={30} className='mr-2' />
              pool.pm
            </button>

            <button
              onClick={() => window.open(`https://www.jpg.store/asset/${asset.tokenId}`, '_blank', 'noopener noreferrer')}
              className='w-full my-1 py-2 px-4 flex items-center justify-start bg-gray-700 border border-gray-600 rounded hover:bg-gray-500 hover:border-gray-400 hover:text-gray-200'
            >
              <Image unoptimized src='/media/logo/other/jpgstore.png' alt='' width={30} height={30} className='mr-2' />
              JPG Store
            </button>

            {asset.rarityRank ? (
              <button
                onClick={() =>
                  window.open(
                    `https://cnft.tools/${policyId === APE_NATION_POLICY_ID ? 'apenation' : ''}?asset=${asset.tokenName?.onChain}`,
                    '_blank',
                    'noopener noreferrer'
                  )
                }
                className='w-full my-1 py-2 px-4 flex items-center justify-start bg-gray-700 border border-gray-600 rounded hover:bg-gray-500 hover:border-gray-400 hover:text-gray-200'
              >
                <Image unoptimized src='/media/logo/other/cnfttools.png' alt='' width={30} height={30} className='mr-2' />
                CNFT Tools
              </button>
            ) : null}
          </Fragment>
        ) : null}

        <button
          onClick={() => window.open(`https://cardanoscan.io/token/${asset.tokenId}`, '_blank', 'noopener noreferrer')}
          className='w-full my-1 py-2 px-4 flex items-center justify-start bg-gray-700 border border-gray-600 rounded hover:bg-gray-500 hover:border-gray-400 hover:text-gray-200'
        >
          <Image unoptimized src='/media/logo/other/cardanoscan.png' alt='' width={30} height={30} className='mr-2' />
          Cardanoscan
        </button>

        <button
          onClick={() => window.open(`https://cexplorer.io/asset/${asset.fingerprint}`, '_blank', 'noopener noreferrer')}
          className='w-full my-1 py-2 px-4 flex items-center justify-start bg-gray-700 border border-gray-600 rounded hover:bg-gray-500 hover:border-gray-400 hover:text-gray-200'
        >
          <Image unoptimized src='/media/logo/other/cexplorer.png' alt='' width={30} height={30} className='mr-2' />
          Cexplorer
        </button>
      </div>
    </div>
  )
}

const INITIAL_DISPLAY_AMOUNT = 20

export interface CollectionAssetsProps {
  policyId: PolicyId
  withListed?: boolean
  withWallet?: boolean
}

const CollectionAssets = (props: CollectionAssetsProps) => {
  const { policyId, withListed = false, withWallet = false } = props
  const { populatedWallet } = useWallet()

  const [fetching, setFetching] = useState(false)
  const [fetched, setFetched] = useState(false)
  const [traitsFile, setTraitsFile] = useState<{
    [category: string]: PopulatedTrait[]
  }>({})
  const [assetsFile, setAssetsFile] = useState<PopulatedAsset[]>([])
  const [selectedAsset, setSelectedAsset] = useState<PopulatedAsset | null>(null)

  const appendDefault = useCallback(() => {
    const { assets, traits } = getFileForPolicyId(policyId)
    setTraitsFile(traits)
    setAssetsFile(assets)
  }, [policyId])

  const appendWallet = useCallback(() => {
    const { traits } = getFileForPolicyId(policyId)
    setTraitsFile(traits)
    setAssetsFile(populatedWallet?.assets[policyId] as PopulatedAsset[])
  }, [policyId, populatedWallet?.assets])

  const fetchPricesAndAppendListed = useCallback(async () => {
    setFetching(true)

    try {
      const fetched = await badLabsApi.policy.market.getData(policyId)

      const { assets, traits } = getFileForPolicyId(policyId)
      const mappedAssets = assets.map((asset) => {
        const found = fetched.items.find((listed) => listed.tokenId === asset.tokenId)

        return {
          ...asset,
          price: !!found ? found.price : 0,
        }
      })

      for await (const listed of fetched.items) {
        const found = mappedAssets.find((asset) => listed.tokenId === asset.tokenId)

        if (!found) {
          const data: Partial<PopulatedAsset> = await badLabsApi.token.getData(listed.tokenId)
          data.price = listed.price
          mappedAssets.push(data as (typeof mappedAssets)[0])
        }
      }

      setTraitsFile(traits)
      setAssetsFile(mappedAssets)
      setFetched(true)
    } catch (error) {
      console.error(error)
      appendDefault()
    }

    setFetching(false)
  }, [policyId, appendDefault])

  useEffect(() => {
    if (withListed) {
      fetchPricesAndAppendListed()
    } else if (withWallet) {
      appendWallet()
    } else {
      appendDefault()
    }
  }, [withListed, withWallet, fetchPricesAndAppendListed, appendWallet, appendDefault])

  const [rendered, setRendered] = useState<PopulatedAsset[]>([])
  // TODO : setDisplayNum using the window width and/or height
  const [displayNum, setDisplayNum] = useState(INITIAL_DISPLAY_AMOUNT)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = (e: Event) => {
      // @ts-ignore
      const { pageYOffset, innerHeight } = e.composedPath()[1]
      const isScrolledToBottom = (bottomRef.current?.offsetTop || 0) <= pageYOffset + innerHeight

      if (isScrolledToBottom) {
        setDisplayNum((prev) => prev + INITIAL_DISPLAY_AMOUNT)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  })

  return (
    <div className='w-screen flex flex-col-reverse md:flex-row items-center md:items-start'>
      <div className='w-full'>
        <div className='flex flex-row flex-wrap items-center justify-center'>
          {fetching ? (
            <Loader />
          ) : !rendered.length ? (
            <div className='text-lg'>None found...</div>
          ) : (
            rendered.map((asset, idx) => {
              if (idx >= displayNum) {
                return null
              }

              return (
                <AssetCard
                  key={`collection-asset-${asset.tokenId}-${idx}`}
                  onClick={() => setSelectedAsset(asset)}
                  isBurned={asset.isBurned}
                  title={asset.tokenName?.display as string}
                  imageSrc={formatIpfsUrl(asset.image.ipfs)}
                  tiedImageSrcs={
                    asset.policyId === 'BLOODLINE' && asset.files?.length
                      ? asset.files
                          .filter((file) => file.mediaType === 'image/png')
                          .map((file) => ({
                            name: file.name,
                            src: formatIpfsUrl(file.src),
                          }))
                      : []
                  }
                  subTitles={
                    asset.isBurned
                      ? ['Asset Burned']
                      : [
                          asset.rarityRank ? `Rank: ${asset.rarityRank}` : '',
                          withListed ? (asset.price ? `Listed: ${ADA_SYMBOL}${asset.price}` : 'Unlisted') : '',
                        ]
                  }
                />
              )
            })
          )}
        </div>

        <div ref={bottomRef} />
      </div>

      <AssetFilters
        policyId={policyId}
        traitsData={traitsFile}
        assetsData={assetsFile}
        withListed={withListed && fetched}
        callbackRendered={(arr) => setRendered(arr)}
      />

      {selectedAsset ? (
        <Modal title={selectedAsset.tokenName?.display} open onClose={() => setSelectedAsset(null)}>
          <AssetModalContent policyId={policyId} asset={selectedAsset} withWallet={withWallet} />
        </Modal>
      ) : null}
    </div>
  )
}

export default CollectionAssets
