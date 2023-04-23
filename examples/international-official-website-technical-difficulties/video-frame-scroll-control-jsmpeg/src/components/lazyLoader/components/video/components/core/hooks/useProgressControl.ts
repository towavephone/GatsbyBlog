import { useEffect, useState } from 'react'

import { CommonProps } from '../index'

export interface UseProgressControlProps {
  progress?: number
  playStrategy?: 'progressControl'
}

const useProgressControl = ({
  progress,
  playStrategy,
  onSetVideoProps,
  domRef
}: UseProgressControlProps & CommonProps) => {
  const [isLoad, setIsLoad] = useState(true)
  const [duration, setDuration] = useState(0)

  const handleLoadedMetadata = () => {
    // @ts-expect-error
    const { duration } = domRef.current
    setDuration(duration)
    setIsLoad(false)
  }

  useEffect(() => {
    if (isLoad || typeof progress !== 'number' || playStrategy !== 'progressControl') {
      return
    }

    const calcProgress = progress < 0 ? 0 : progress > 1 ? 1 : progress
    // @ts-expect-error
    domRef.current.currentTime = calcProgress * duration
  }, [progress, isLoad])

  useEffect(() => {
    if (playStrategy === 'progressControl') {
      onSetVideoProps({
        muted: true,
        playsInline: true,
        preload: 'metadata'
      })
    }
  }, [playStrategy])

  return {
    handleLoadedMetadata
  }
}

export default useProgressControl
