import { useScroll, usePrevious, useThrottle } from 'ahooks'
import type { Target, ScrollListenController } from 'ahooks/lib/useScroll'
import type { ThrottleOptions } from 'ahooks/lib/useThrottle/throttleOptions'

interface UseScrollDirectionResult {
  leftDelta: number
  topDelta: number
  scrollXDirection?: 'left' | 'right'
  scrollYDirection?: 'up' | 'down'
  left: number
  top: number
}

const useScrollDirection = (target: Target, shouldUpdate?: ScrollListenController, options: ThrottleOptions & { enable: boolean } = {
  enable: false,
  wait: 300,
  leading: true,
  trailing: true
}): UseScrollDirectionResult => {
  const position = useScroll(target, shouldUpdate)
  const prevPosition = usePrevious(position)

  const throttledPosition = useThrottle(position, options)
  const throttledPrevPosition = useThrottle(prevPosition, options)

  const newPosition = options.enable ? throttledPosition : position
  const newPrevPosition = options.enable ? throttledPrevPosition : prevPosition

  if (!newPosition || !newPrevPosition) {
    return {
      leftDelta: 0,
      topDelta: 0,
      left: 0,
      top: 0
    }
  }

  const leftDelta = newPosition.left - newPrevPosition.left
  const topDelta = newPosition.top - newPrevPosition.top

  const scrollXDirection = leftDelta > 0 ? 'right' : 'left'
  const scrollYDirection = topDelta > 0 ? 'down' : 'up'

  // console.log('throttledPosition', newPosition, newPrevPosition)

  return {
    leftDelta,
    topDelta,
    scrollXDirection,
    scrollYDirection,
    left: newPosition.left,
    top: newPosition.top
  }
}

export default useScrollDirection
