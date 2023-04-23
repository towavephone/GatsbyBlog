import { useEffect } from 'react'

import { CommonProps } from '../index'

export interface UseClickPlayWithControlProps {
  playStrategy?: 'clickPlayWithControl'
  playing?: boolean
}

const useClickPlayWithControl = ({
  playStrategy,
  onSetVideoProps,
  playing,
  domRef
}: UseClickPlayWithControlProps & CommonProps) => {
  useEffect(() => {
    if (playStrategy === 'clickPlayWithControl') {
      onSetVideoProps({
        controls: true,
        playsInline: true
      })
    }
  }, [playStrategy])

  const handleCanPlay = () => {
    if (playStrategy === 'clickPlayWithControl') {
      if (playing) {
        domRef.current?.play()
      } else {
        domRef.current?.pause()
      }
    }
  }

  return {
    handleCanPlay
  }
}

export default useClickPlayWithControl
