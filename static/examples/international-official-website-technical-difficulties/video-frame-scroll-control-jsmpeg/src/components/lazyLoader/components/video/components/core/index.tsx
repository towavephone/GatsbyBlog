import classNames from 'classnames'
import React, {
  useRef,
  ReactNode,
  useState,
  Dispatch,
  SetStateAction,
  RefObject,
  forwardRef,
  ForwardedRef,
  useImperativeHandle
} from 'react'

import XIcon from '@/components/xIcon'
import useResetStatus from '@/components/lazyLoader/hooks/useResetStatus'
import useSrcSet, { UseSrcSetProps } from '@/components/lazyLoader/hooks/useSrcSet'

import useProgressControl, { UseProgressControlProps } from './hooks/useProgressControl'
import useClickPlay, { UseClickPlayProps } from './hooks/useClickPlay'
import useClickPlayWithControl, { UseClickPlayWithControlProps } from './hooks/useClickPlayWithControl'
import useMouseOverPlay, { UseMouseOverPlayProps } from './hooks/useMouseOverPlay'
import useInViewportPlay, { UseInViewportPlayProps } from './hooks/useInViewportPlay'

import styles from '../../index.module.less'

export type CoreProps<T = never> = JSX.IntrinsicElements['video'] & UseSrcSetProps & {
  children?: ReactNode
  onPlayIconClick?: () => void
  showPlayIcon?: boolean
  srcPoster?: string
  srcSetPoster?: string
  minSrcSetPoster?: string
} & (
  {
    playStrategy?: 'autoPlay'
  }
  |
  UseProgressControlProps
  |
  UseClickPlayProps
  |
  UseClickPlayWithControlProps
  |
  UseMouseOverPlayProps
  |
  UseInViewportPlayProps
  |
  T
)

export interface CommonProps {
  domRef: RefObject<HTMLVideoElement>
  onSetVideoProps: Dispatch<SetStateAction<JSX.IntrinsicElements['video']>>
  onSetIsPlay: Dispatch<SetStateAction<boolean>>
}

export interface CoreRef {
  getVideoElement: () => HTMLVideoElement | null
}

const Core = ({
  src,
  srcSet,
  minSrcSet,
  srcPoster,
  srcSetPoster,
  minSrcSetPoster,
  className,
  children,
  playStrategy = 'autoPlay',
  showPlayIcon = true,
  onPlayIconClick,
  ...rest
}: CoreProps, ref: ForwardedRef<CoreRef>) => {
  const currentSrc = useSrcSet({
    src,
    srcSet,
    minSrcSet
  })

  const currentPoster = useSrcSet({
    src: srcPoster,
    srcSet: srcSetPoster,
    minSrcSet: minSrcSetPoster
  })

  const domRef = useRef<HTMLVideoElement>(null)

  useImperativeHandle(ref, () => (
    {
      getVideoElement: () => domRef.current
    }
  ))

  useResetStatus(domRef, [currentSrc])

  // 默认自动播放，即 playStrategy === 'autoPlay'
  const [videoProps, setVideoProps] = useState<JSX.IntrinsicElements['video']>({
    muted: true,
    loop: true,
    autoPlay: true,
    playsInline: true
  })

  const { handleLoadedMetadata } = useProgressControl({
    domRef,
    onSetVideoProps: setVideoProps,
    playStrategy,
    ...rest
  } as any)

  const [isPlay, setIsPlay] = useState(false)

  const { handleVideoPlay } = useClickPlay({
    domRef,
    onSetVideoProps: setVideoProps,
    playStrategy,
    onSetIsPlay: setIsPlay,
    ...rest
  } as any)

  const { handleCanPlay } = useClickPlayWithControl({
    onSetVideoProps: setVideoProps,
    playStrategy,
    domRef,
    ...rest
  } as any)

  const { handleMouseEnter, handleMouseLeave } = useMouseOverPlay({
    domRef,
    onSetVideoProps: setVideoProps,
    playStrategy,
    onSetIsPlay: setIsPlay,
    ...rest
  } as any)

  useInViewportPlay({
    onSetVideoProps: setVideoProps,
    playStrategy,
    domRef,
    ...rest
  } as any)

  const allVideoProps = {
    ...videoProps,
    ...rest,
    ref: domRef,
    'data-src': currentSrc,
    'data-poster': currentPoster,
    onLoadedMetadata: handleLoadedMetadata,
    onCanPlay: handleCanPlay
  }

  if (playStrategy === 'autoPlay') {
    return <video
      {...allVideoProps}
      className={classNames('lazy', className)}
    >
      {children}
    </video>
  }

  return (
    <div
      className={classNames(styles.container, className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        {...allVideoProps}
        className={classNames('lazy')}
      >
        {children}
      </video>
      {
        (
          playStrategy === 'clickPlay' ||
          playStrategy === 'mouseOverPlay'
        ) &&
        !isPlay &&
        showPlayIcon && (
          <XIcon
            className={classNames(styles.playIcon, 'play-icon')}
            name="play"
            onClick={onPlayIconClick || handleVideoPlay}
          />
        )
      }
    </div>
  )
}

export default forwardRef(Core)
