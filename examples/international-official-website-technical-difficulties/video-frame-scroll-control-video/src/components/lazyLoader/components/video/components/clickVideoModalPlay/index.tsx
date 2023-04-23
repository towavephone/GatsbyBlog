import React, { useImperativeHandle, forwardRef, ForwardedRef } from 'react'

import useVideoImgModal from '@/hooks/useVideoImgModal'

import Core from '../../components/core'

export interface ClickVideoModalPlayProps {
  playStrategy?: 'clickVideoModalPlay'
  longSrc?: string
  longSrcSet?: string
  longMinSrcSet?: string
}

export interface ClickVideoModalPlayRef {
  openModal: () => void
}

const ClickVideoModalPlay = (props: ClickVideoModalPlayProps, ref: ForwardedRef<ClickVideoModalPlayRef>) => {
  const { Slot, api, visible } = useVideoImgModal()
  const { src, srcSet, minSrcSet } = props as any
  const { longSrc = src, longSrcSet = srcSet, longMinSrcSet = minSrcSet, playStrategy, ...rest } = props

  useImperativeHandle(ref, () => (
    {
      openModal: () => api.current?.open()
    }
  ))

  return <>
    <Slot
      {...rest}
      src={longSrc}
      srcSet={longSrcSet}
      minSrcSet={longMinSrcSet}
      type="video"
      playStrategy="clickPlayWithControl"
      playing={visible}
    />
    <Core
      {...rest}
      playStrategy="autoPlay"
    />
  </>
}

export default forwardRef(ClickVideoModalPlay)
