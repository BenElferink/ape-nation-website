import Image from 'next/image'
import { CSSProperties, useState } from 'react'
import Loader from '.'

const ImageLoader = (props: {
  src: string
  alt: string
  optimized?: boolean
  width?: number
  height?: number
  loaderSize?: number
  style?: CSSProperties
}) => {
  const { src = '', alt = '', optimized = false, width = 100, height = 100, loaderSize = 0, style = {} } = props
  const [loading, setLoading] = useState(true)

  return (
    <div className='relative z-10' style={style}>
      {loading ? (
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10'>
          <Loader size={loaderSize || Math.min(width, height) * 0.7} />
        </div>
      ) : null}

      <Image src={src} alt={alt} unoptimized={!optimized} onLoad={() => setLoading(false)} width={width} height={height} style={style} />
    </div>
  )
}

export default ImageLoader
