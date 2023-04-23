import { useState, useEffect } from 'react'
import { useSize } from 'ahooks'

import { getDocument } from '@/utils'

type ResponsiveConfig = Record<string, number>
type ResponsiveInfo = Record<string, boolean>

/* 因 ahooks 的 useResponsive 深层次调用时，窗口 resize（从小窗口到大窗口有问题）的时候返回的结果不对，所以重写 useResponsive，所有 API 保持和 useResponsive 一致  */
let responsiveConfig: ResponsiveConfig = {
  small: 0,
  middle: 750,
  large: 1920
}

let info: ResponsiveInfo = {}

function calculate () {
  const width = window.innerWidth
  const newInfo = {} as ResponsiveInfo
  let shouldUpdate = false
  for (const key of Object.keys(responsiveConfig)) {
    newInfo[key] = width >= responsiveConfig[key]
    if (newInfo[key] !== info[key]) {
      shouldUpdate = true
    }
  }
  if (shouldUpdate) {
    info = newInfo
  }
}

export function configResponsive (config: ResponsiveConfig) {
  responsiveConfig = config
  if (info) calculate()
}

const useResponsive = () => {
  const [state, setState] = useState<ResponsiveInfo>(info)
  const size = useSize(getDocument()?.documentElement)
  useEffect(() => {
    calculate()
    setState(info)
  }, [size?.width])
  return state
}

export default useResponsive
