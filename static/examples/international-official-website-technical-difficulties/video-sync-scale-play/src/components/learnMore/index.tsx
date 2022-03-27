import React, { useState, useRef, useEffect } from 'react'
import classNames from 'classnames'
import { useInViewport } from 'ahooks'
import { isNumber } from 'lodash'

import { SceneProps } from '@/components/reactScrollMagic'
import { l, VideoRef } from '@/components/lazyLoader'

import { getAnimateProgresses } from '@/utils/animate'

import useStoreContext, { CLIENT_TYPE } from '@/hooks/useStoreContext'

import ModelLearnMore from '../modelLearnMore'

import styles from './index.module.less'

export type VisibleComponent = 'JsmpegPlayer' | 'ModelLearnMore'

const MAX_THRESHOLD = 0.99
const MIN_THRESHOLD = 0.01
const THRESHOLD = [MIN_THRESHOLD, MAX_THRESHOLD]

const Index = ({
  sceneParams
}: SceneProps) => {
  const {
    progress = 0
  } = sceneParams || {}

  const [modelLearnMoreProgress] = getAnimateProgresses(progress, [
    {
      start: 1 / 2,
      duration: 1 / 2
    }
  ])

  // 设置哪个组件可见
  const [visibleComponent, setVisibleComponent] = useState<VisibleComponent>('JsmpegPlayer')

  const { state } = useStoreContext()

  const videoRef = useRef<VideoRef>(null)
  const miniVideoRef = useRef<VideoRef>(null)

  const containerRef = useRef(null)
  const [_, ratio] = useInViewport(containerRef, {
    threshold: THRESHOLD
  })

  const [isPlayed, setIsPlayed] = useState(false)

  useEffect(() => {
    if (state?.clientType === CLIENT_TYPE.H5) {
      return
    }

    const videoDom = videoRef.current?.getVideoElement()
    const miniVideoDom = miniVideoRef.current?.getVideoElement()
    if (!isNumber(ratio) || !videoDom || !miniVideoDom) {
      return
    }

    if (ratio > MAX_THRESHOLD && !isPlayed && visibleComponent === 'JsmpegPlayer') {
      videoDom.play()
      setIsPlayed(true)
    }

    if (ratio > MAX_THRESHOLD && !isPlayed && visibleComponent === 'ModelLearnMore') {
      miniVideoDom.play()
      setIsPlayed(true)
    }

    if (ratio < MIN_THRESHOLD) {
      videoDom.currentTime = 0
      videoDom.pause()

      miniVideoDom.currentTime = 0
      miniVideoDom.pause()
      setIsPlayed(false)
    }
  }, [ratio, visibleComponent, isPlayed])

  useEffect(() => {
    if (state?.clientType === CLIENT_TYPE.H5) {
      return
    }

    const videoDom = videoRef.current?.getVideoElement()
    const miniVideoDom = miniVideoRef.current?.getVideoElement()
    if (!videoDom || !miniVideoDom) {
      return
    }

    if (visibleComponent === 'ModelLearnMore') {
      miniVideoDom.currentTime = videoDom.currentTime
      if (miniVideoDom.currentTime < miniVideoDom.duration) {
        miniVideoDom.play()
      }
    } else {
      videoDom.currentTime = miniVideoDom.currentTime
      if (videoDom.currentTime < videoDom.duration) {
        videoDom.play()
      }
    }
  }, [visibleComponent])

  let miniVideoProps = {
    type: 'video',
    srcPoster: '/GATSBY_PUBLIC_DIR/public/videos/p7-wing@mini.jpg',
    src: '/GATSBY_PUBLIC_DIR/public/videos/p7-wing-origin-fast.mp4'
  }

  if (state?.clientType === CLIENT_TYPE.PC) {
    miniVideoProps = {
      ...miniVideoProps,
      // @ts-expect-error
      loop: false,
      autoPlay: false,
      ref: miniVideoRef,
      isNeedScale: true
    }
  }

  return (
    <div
      ref={containerRef}
      className={styles.container}
    >
      {
        state?.clientType === CLIENT_TYPE.PC && <l.video
          ref={videoRef}
          loop={false}
          autoPlay={false}
          src="/GATSBY_PUBLIC_DIR/public/videos/p7-wing-origin-fast.mp4"
          className={classNames(styles.player, visibleComponent !== 'JsmpegPlayer' ? styles.hidden : '')}
        />
      }
      <ModelLearnMore
        className={state?.clientType === CLIENT_TYPE.PC && visibleComponent !== 'ModelLearnMore' ? styles.hidden : ''}
        progress={state?.clientType === CLIENT_TYPE.PC ? modelLearnMoreProgress : 100}
        modelCenterTextProps={{
          topSubTitle: 'topSubTitle',
          title: 'title',
          subTitle: 'subTitle',
          shortDesc: 'shortDesc',
          buttonText: 'button',
          animation: state?.clientType === CLIENT_TYPE.H5
        }}
        onSetVisibleComponent={setVisibleComponent}
        displayersProps={[
          {
            src: '/GATSBY_PUBLIC_DIR/public/images/p7-p2-1.jpg',
          },
          {
            src: '/GATSBY_PUBLIC_DIR/public/images/p7-p2-2.jpg',
          },
          // @ts-expect-error
          miniVideoProps
        ]}
      />
    </div>
  )
}

export default Index
