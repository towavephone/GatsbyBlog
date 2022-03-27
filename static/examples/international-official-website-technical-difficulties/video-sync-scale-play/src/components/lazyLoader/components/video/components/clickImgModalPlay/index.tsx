import React, { forwardRef, ForwardedRef, useImperativeHandle } from 'react'
import classNames from 'classnames'
import { Button } from 'antd'

import Div from '@/components/lazyLoader/components/div'
import XIcon from '@/components/xIcon'

import useVideoImgModal from '@/hooks/useVideoImgModal'

import Core from '../core'

import styles from '../../index.module.less'

export interface ClickImgModalPlayProps {
  playStrategy?: 'clickImgModalPlay'
  srcPoster?: string
  srcSetPoster?: string
  minSrcSetPoster?: string
  playIconPosition?: 'center' | 'bottom'
  showPlayIcon?: boolean
}

export interface ClickImgModalPlayRef {
  openModal: () => void
}

const ClickImgModalPlay = (props: ClickImgModalPlayProps, ref: ForwardedRef<ClickImgModalPlayRef>) => {
  const { Slot, api, visible } = useVideoImgModal()
  const {
    srcPoster,
    srcSetPoster,
    minSrcSetPoster,
    playStrategy,
    playIconPosition = 'center',
    showPlayIcon = true,
    ...rest
  } = props

  useImperativeHandle(ref, () => (
    {
      openModal: () => api.current?.open()
    }
  ))

  if (!srcPoster && !srcSetPoster && !minSrcSetPoster) {
    return <>
      <Slot
        {...rest}
        type="video"
        playStrategy="clickPlayWithControl"
        playing={visible}
      />
      <Core
        {...rest}
        playStrategy="clickPlay"
        showPlayIcon={showPlayIcon}
        onPlayIconClick={() => api.current?.open()}
      />
    </>
  }

  return <Div
    // @ts-expect-error
    className={classNames(props.className, styles.container)}
    src={srcPoster}
    srcSet={srcSetPoster}
    minSrcSet={minSrcSetPoster}
  >
    <Slot
      {...rest}
      type="video"
      playStrategy="clickPlayWithControl"
      playing={visible}
    />
    {
      showPlayIcon && <>
        {
          playIconPosition === 'center' && <XIcon
            className={classNames(styles.playIcon, 'play-icon')}
            name="play"
            onClick={() => api.current?.open()}
          />
        }
        {
          playIconPosition === 'bottom' && <Button
            className={classNames(styles.playBottomIcon, 'play-bottom-icon')}
            type="ghost"
            onClick={() => api.current?.open()}
          >
            Watch Video
          </Button>
        }
      </>
    }
  </Div>
}

export default forwardRef(ClickImgModalPlay)
