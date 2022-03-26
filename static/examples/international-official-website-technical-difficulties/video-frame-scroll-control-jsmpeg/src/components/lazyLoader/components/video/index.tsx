import React, { forwardRef, ForwardedRef } from 'react'

import useStoreContext, { CLIENT_TYPE } from '@/hooks/useStoreContext'

import Core, { CoreProps, CoreRef } from './components/core'
import ClickImgModalPlay, { ClickImgModalPlayProps, ClickImgModalPlayRef } from './components/clickImgModalPlay'
import ClickVideoModalPlay, { ClickVideoModalPlayProps, ClickVideoModalPlayRef } from './components/clickVideoModalPlay'

export type VideoProps = CoreProps<ClickImgModalPlayProps | ClickVideoModalPlayProps>
export type { ClickVideoModalPlayRef } from './components/clickVideoModalPlay'
export type { ClickImgModalPlayRef } from './components/clickImgModalPlay'
export type { CoreRef } from './components/core'

const Video = (props: VideoProps, ref: ForwardedRef<ClickVideoModalPlayRef | ClickImgModalPlayRef | CoreRef>) => {
  const {
    playStrategy
  } = props

  const { state } = useStoreContext()

  // 不传 playStrategy 时 h5 强制所有视频弹窗播放，传 playStrategy 改变播放策略
  if (playStrategy === 'clickImgModalPlay' || (!playStrategy && state?.clientType === CLIENT_TYPE.H5)) {
    return <ClickImgModalPlay
      ref={ref}
      {...props as any}
    />
  }

  if (playStrategy === 'clickVideoModalPlay') {
    return <ClickVideoModalPlay
      ref={ref}
      {...props as any}
    />
  }

  return <Core ref={ref} {...props as any} />
}

export default forwardRef(Video)
