import Image from 'next/image'
import { CSSProperties, Fragment } from 'react'
import useScreenSize from '@/hooks/useScreenSize'
import ImageLoader from '../Loader/ImageLoader'

export interface AssetCardProps {
  isBurned?: boolean
  title: string
  imageSrc: string
  tiedImageSrcs?: { src: string; name: string }[]
  subTitles?: string[]
  onClick?: () => void
  style?: CSSProperties
}

const AssetCard = (props: AssetCardProps) => {
  const { isBurned, title, imageSrc, tiedImageSrcs, subTitles, onClick, style = {} } = props
  const { isMobile } = useScreenSize()

  return (
    <div
      onClick={() => (!!onClick && typeof onClick === 'function' ? onClick() : null)}
      className={
        (!!onClick && typeof onClick === 'function' ? 'cursor-pointer' : '') +
        ' flex flex-col-reverse md:flex-row mx-2 mb-4 mt-0 rounded-xl border border-zinc-950 hover:border-zinc-200 bg-zinc-950/70 hover:bg-zinc-700/70'
      }
    >
      <div className='relative flex flex-col items-center truncate w-[248px]' style={style}>
        <ImageLoader
          src={imageSrc}
          alt={title}
          width={248}
          height={248}
          style={{ width: 248, height: 248, objectFit: 'contain', borderRadius: '0.75rem 0.75rem 0 0', backgroundColor: 'black' }}
        />
        {isBurned ? (
          <div className='absolute top-0 left-0 z-10 flex items-center justify-center w-[248px] h-[248px] bg-zinc-900 bg-opacity-50'>
            <Image unoptimized src='/media/fire.png' alt='BURNED' sizes='10rem' width={150} height={150} />
          </div>
        ) : null}

        <div className='w-full px-4 py-2'>
          <h5 className='text-lg'>{title}</h5>

          {subTitles && subTitles.length ? (
            <Fragment>
              <div className='h-[1px] my-2 bg-zinc-400' />

              {subTitles.map((str) =>
                str ? (
                  <h6 key={`${title}-h6-${str}`} className='text-sm'>
                    {str}
                  </h6>
                ) : null
              )}
            </Fragment>
          ) : null}
        </div>
      </div>

      {!!tiedImageSrcs?.length ? (
        <div className='flex md:flex-col-reverse items-center justify-center md:justify-start'>
          {tiedImageSrcs.map((file, idx) => (
            <div key={`tied-img-${file.name}`} className='w-[84px] md:w-[111px]' style={style}>
              <ImageLoader
                src={file.src}
                alt={file.name}
                width={isMobile ? 84 : 111}
                height={isMobile ? 84 : 111}
                style={{
                  borderRadius: isMobile
                    ? idx === 0
                      ? '0.5rem 0 0 0'
                      : idx === tiedImageSrcs.length - 1
                      ? '0 0.5rem 0 0'
                      : '0'
                    : idx === 0
                    ? '0 0 0.5rem 0'
                    : idx === tiedImageSrcs.length - 1
                    ? '0 0.5rem 0 0'
                    : '0',
                }}
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default AssetCard
