import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { format } from 'timeago.js'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import useScreenSize from '@/hooks/useScreenSize'
import getFileForPolicyId from '@/functions/getFileForPolicyId'
import formatIpfsUrl from '@/functions/formatters/formatIpfsUrl'
import formatBigNumber from '@/functions/formatters/formatBigNumber'
import Loader from './Loader'
import ImageLoader from './Loader/ImageLoader'
import type { BadLabsApiMarket } from '@/utils/badLabsApi'
import type { PolicyId } from '@/@types'
import { ADA_SYMBOL, BLOODLINE_POLICY_ID } from '@/constants'

const RecentMarketActivity = (props: { policyId: PolicyId }) => {
  const { policyId } = props
  const { screenWidth } = useScreenSize()

  const imageSize = 170
  const [slidesPerView, setSlidesPerView] = useState(0)
  const [renderItems, setRenderItems] = useState<BadLabsApiMarket['items']>([])
  const [fetching, setFetching] = useState(false)

  const assetsFile = useMemo(() => getFileForPolicyId(policyId), [policyId])

  useEffect(() => {
    const _l = renderItems.length
    if (!!_l) {
      const _v = Math.floor((screenWidth * 0.9) / imageSize)
      setSlidesPerView(_v < _l ? _v : _l)
    } else {
      setSlidesPerView(0)
    }
  }, [screenWidth, renderItems])

  // JPG Store API === DEAD💀
  // useEffect(() => {
  //   setRenderItems([]);
  //   setFetching(true);

  //   api.policy.market
  //     .getActivity(policyId)
  //     .then((payload) => setRenderItems(payload.items))
  //     .catch((error) => console.error(error))
  //     .finally(() => setFetching(false));
  // }, [policyId]);

  return (
    <section className='w-full my-4 mx-auto'>
      {fetching ? (
        <Loader />
      ) : !!slidesPerView ? (
        <Swiper
          slidesPerView={slidesPerView}
          modules={[Navigation]} // Autoplay
          navigation
          // autoplay={{
          //   delay: 1700,
          //   reverseDirection: false,
          //   disableOnInteraction: false,
          //   pauseOnMouseEnter: false,
          //   stopOnLastSlide: false,
          // }}
          // loop
        >
          {renderItems.map((item, idx) => {
            const thisAsset = assetsFile.assets.find((obj) => obj.tokenId === item.tokenId)
            if (!thisAsset) return null

            return (
              <SwiperSlide key={`recently-sold-${item.tokenId}-${idx}`}>
                <div className='relative rounded-full border border-zinc-900 shadow-inner' style={{ width: imageSize, height: imageSize }}>
                  <Link
                    href={`https://jpg.store/asset/${item.tokenId}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    style={{ width: imageSize, height: imageSize }}
                  >
                    <ImageLoader
                      src={formatIpfsUrl(thisAsset?.image.ipfs || '', { forceNonJpg: policyId === BLOODLINE_POLICY_ID })}
                      alt={thisAsset?.tokenName?.display || ''}
                      width={imageSize}
                      height={imageSize}
                      style={{ width: imageSize, height: imageSize, objectFit: 'cover', borderRadius: '100%', backgroundColor: 'black' }}
                    />
                    <p className='px-2 text-black text-xs text-center font-light whitespace-nowrap rounded-lg bg-[var(--accent-2)] absolute -bottom-[1px] left-1/2 -translate-x-1/2 z-20'>
                      <span className='text-sm'>
                        {item.activityType === 'LIST' ? 'Listed' : item.activityType === 'SELL' ? 'Bought' : item.activityType}
                      </span>{' '}
                      {format(new Date(item.date))},{' '}
                      <span className='text-sm'>
                        {ADA_SYMBOL}
                        {formatBigNumber(item.price)}
                      </span>
                    </p>
                  </Link>
                </div>
              </SwiperSlide>
            )
          })}
        </Swiper>
      ) : null}
    </section>
  )
}

export default RecentMarketActivity
