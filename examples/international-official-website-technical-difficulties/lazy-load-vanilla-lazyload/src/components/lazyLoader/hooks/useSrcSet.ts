import { useEffect, useState } from 'react'

import useResponsive from './useResponsive'

export interface UseSrcSetProps {
  src?: string
  srcSet?: string
  minSrcSet?: string
}

const useSrcSet = ({
  src,
  srcSet,
  minSrcSet
}: UseSrcSetProps) => {
  const responsive = useResponsive()
  const [localSrc, setLocalSrc] = useState(src)

  useEffect(() => {
    const srcMap = [
      {
        size: 'large',
        src: srcSet
      },
      {
        size: 'middle',
        src: src
      },
      {
        size: 'small',
        src: minSrcSet
      }
    ]
    srcMap.some((item) => {
      const { size, src } = item
      const isFit = responsive[size] && src
      if (isFit) {
        // console.log('src', responsive, size, src)
        setLocalSrc(src)
      }
      return isFit
    })
  }, [responsive, minSrcSet, src, srcSet])

  return localSrc
}

export default useSrcSet
