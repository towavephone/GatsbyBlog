import React, { useRef, useEffect, useState } from 'react'
import { useInViewport, useAsyncEffect } from 'ahooks'

import { loadScript } from '@/utils'

interface JsmpegPlayerProps {
  src: string
  progress?: number // 播放进度，0~1
  className?: string
  autoplay?: boolean
  loop?: boolean
  seekable?: boolean
  preserveDrawingBuffer?: boolean
}

const OgvPlayer = ({
  src,
  progress,
  className,
  ...rest
}: JsmpegPlayerProps) => {
  const [isLoad, setIsLoad] = useState(true)
  const [isLoadJsmpeg, setIsLoadJsmpeg] = useState(true)
  const playerRef = useRef()
  const domRef = useRef(null)

  useAsyncEffect(async () => {
    await loadScript('/GATSBY_PUBLIC_DIR/public/lib/ogvjs-1.8.6/ogv.js')
    setIsLoadJsmpeg(false)
  }, [])

  const [inViewPort] = useInViewport(domRef)
  useEffect(() => {
    if (!inViewPort || isLoadJsmpeg || !isLoad) {
      return
    }
    // eslint-disable-next-line new-cap
    playerRef.current = new window.OGVPlayer({
      wasm: true, // force,
      simd: true, // experimental
      // threading: true
    })
    // @ts-expect-error
    domRef.current.appendChild(playerRef.current)
    // @ts-expect-error
    playerRef.current.muted = true
    // @ts-expect-error
    playerRef.current.width = window.innerWidth
    // @ts-expect-error
    playerRef.current.height = window.innerHeight
    // @ts-expect-error
    playerRef.current.src = src
    // @ts-expect-error
    playerRef.current.addEventListener('loadedmetadata', () => {
      setIsLoad(false)
    })
  }, [inViewPort, isLoadJsmpeg])

  useEffect(() => {
    if (isLoad || typeof progress !== 'number') {
      return
    }
    const calcProgress = progress < 0 ? 0 : progress > 1 ? 1 : progress
    // console.log('calcProgress', calcProgress)
    // @ts-expect-error
    playerRef.current.currentTime = calcProgress * playerRef.current.duration
  }, [progress, isLoad])

  return (
    <div ref={domRef} className={className}>
    </div>
  )
}

export default OgvPlayer
