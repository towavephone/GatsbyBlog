import React, { useRef, useEffect, useState } from 'react'
import classNames from 'classnames'
import { useInViewport, useAsyncEffect } from 'ahooks'

import { l } from '@/components/lazyLoader'

import { loadScript } from '@/utils'

import styles from './index.module.less'

interface JsmpegPlayerProps {
  src: string
  progress?: number // 播放进度，0~1
  className?: string
  poster?: string
}

// https://github.com/phoboslab/jsmpeg/tree/v0.2
const JsmpegPlayer = ({
  src,
  progress,
  className,
  poster,
  ...rest
}: JsmpegPlayerProps) => {
  const [isLoad, setIsLoad] = useState(true)
  const [isLoadJsmpeg, setIsLoadJsmpeg] = useState(true)
  const playerRef = useRef()
  const domRef = useRef(null)

  useAsyncEffect(async () => {
    await loadScript('/GATSBY_PUBLIC_DIR/public/lib/jsmpeg.min.js')
    setIsLoadJsmpeg(false)
  }, [])

  const [inViewPort] = useInViewport(domRef)
  useEffect(() => {
    if (!inViewPort || isLoadJsmpeg || !isLoad) {
      return
    }
    // eslint-disable-next-line new-cap
    playerRef.current = new window.jsmpeg(src, {
      ...rest,
      // @ts-expect-error
      canvas: domRef.current?.querySelector('canvas'),
      seekable: true,
      onload: () => {
        setIsLoad(false)
        // console.log(playerRef.current?.duration, playerRef.current?.frameCount)
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inViewPort, isLoadJsmpeg])

  useEffect(() => {
    if (isLoad || typeof progress !== 'number') {
      return
    }
    const calcProgress = progress < 0 ? 0 : progress > 1 ? 1 : progress
    // @ts-expect-error
    const frameCount = playerRef.current?.frameCount - 1 // 最大帧需减一
    // @ts-expect-error
    playerRef.current?.seekToFrame(calcProgress * frameCount, true)
  }, [progress, isLoad])

  const isShowPoster = (isLoad || isLoadJsmpeg) && poster
  return <div
    ref={domRef}
    className={classNames(styles.container, className)}
  >
    <div className={styles.body}>
      <canvas
        className={styles.video}
      />
      {
        isShowPoster && <l.img
          src={poster}
          className={styles.poster}
        />
      }
    </div>
  </div>
}

export default JsmpegPlayer
