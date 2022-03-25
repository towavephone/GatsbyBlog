import { useEffect, useState } from 'react'
import { useInViewport } from 'ahooks'
import { isNumber } from 'lodash'

import { CommonProps } from '../index'

const MAX_THRESHOLD = 0.99
const MIN_THRESHOLD = 0.01
const THRESHOLD = [MIN_THRESHOLD, MAX_THRESHOLD]

export interface UseInViewportPlayProps {
  playStrategy?: 'inViewportPlay'
}

const useInViewportPlay = ({
  playStrategy,
  onSetVideoProps,
  domRef
}: UseInViewportPlayProps & CommonProps) => {
  useEffect(() => {
    if (playStrategy !== 'inViewportPlay') {
      return
    }

    onSetVideoProps({
      muted: true,
      playsInline: true
    })
  }, [playStrategy])

  const [_, ratio] = useInViewport(domRef, {
    threshold: THRESHOLD
  })

  // console.log('inViewport', inViewport, ratio)

  const [isPlayed, setIsPlayed] = useState(false)

  useEffect(() => {
    if (playStrategy !== 'inViewportPlay' || !isNumber(ratio)) {
      return
    }

    if (ratio > MAX_THRESHOLD && !isPlayed) {
      domRef.current?.play()
      setIsPlayed(true)
    }

    if (ratio < MIN_THRESHOLD) {
      // @ts-expect-error
      domRef.current.currentTime = 0
      domRef.current?.pause()
      setIsPlayed(false)
    }
  }, [playStrategy, ratio])
}

export default useInViewportPlay
