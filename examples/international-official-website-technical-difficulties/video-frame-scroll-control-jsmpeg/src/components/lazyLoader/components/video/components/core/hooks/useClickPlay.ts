import { useEffect } from 'react'

import { CommonProps } from '../index'

export interface UseClickPlayProps {
  playStrategy?: 'clickPlay'
}

const useClickPlay = ({
  domRef,
  playStrategy,
  onSetVideoProps,
  onSetIsPlay
}: UseClickPlayProps & CommonProps) => {
  const handleVideoPlay = () => {
    if (playStrategy === 'clickPlay') {
      domRef.current?.play()
      onSetIsPlay(true)
    }
  }

  useEffect(() => {
    if (playStrategy === 'clickPlay') {
      onSetVideoProps({
        muted: true,
        loop: true,
        playsInline: true
      })
    }
  }, [playStrategy])

  return {
    handleVideoPlay
  }
}

export default useClickPlay
