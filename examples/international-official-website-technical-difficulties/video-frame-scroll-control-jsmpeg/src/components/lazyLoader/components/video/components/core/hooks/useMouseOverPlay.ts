import { useEffect } from 'react'

import { CommonProps } from '../index'

export interface UseMouseOverPlayProps {
  playStrategy?: 'mouseOverPlay'
}

const useMouseOverPlay = ({
  domRef,
  playStrategy,
  onSetVideoProps,
  onSetIsPlay
}: UseMouseOverPlayProps & CommonProps) => {
  const handleMouseEnter = () => {
    if (playStrategy === 'mouseOverPlay') {
      domRef.current?.play()
      onSetIsPlay(true)
    }
  }

  const handleMouseLeave = () => {
    if (playStrategy === 'mouseOverPlay') {
      domRef.current?.pause()
      // @ts-expect-error
      domRef.current.currentTime = 0
      onSetIsPlay(false)
    }
  }

  useEffect(() => {
    if (playStrategy === 'mouseOverPlay') {
      onSetVideoProps({
        muted: true,
        loop: true,
        playsInline: true
      })
    }
  }, [playStrategy])

  return {
    handleMouseEnter,
    handleMouseLeave
  }
}

export default useMouseOverPlay
