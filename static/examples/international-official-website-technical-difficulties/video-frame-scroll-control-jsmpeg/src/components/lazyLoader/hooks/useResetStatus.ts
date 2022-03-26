import LazyLoad from 'vanilla-lazyload'
import { LazyLoaderContext } from '@/components/lazyLoader/lazyLoaderContext' // 避免循环引用
import { useContext, useEffect, DependencyList } from 'react'

import type { BasicTarget } from '../utils/domTarget'
import { getTargetElement } from '../utils/domTarget'

const useResetStatus = (target: BasicTarget, effect: DependencyList | undefined) => {
  const lazyLoad = useContext(LazyLoaderContext)
  useEffect(() => {
    if (!lazyLoad) {
      return
    }
    const el = getTargetElement(target)
    if (el) {
      LazyLoad.resetStatus(el)
    }
    // console.log('触发 useResetStatus 方法')
    lazyLoad.update()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lazyLoad, ...(effect || [])])
}

export default useResetStatus
