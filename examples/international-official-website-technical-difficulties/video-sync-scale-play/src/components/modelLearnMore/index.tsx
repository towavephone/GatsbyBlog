import React, { useEffect, useState, Dispatch, SetStateAction, useRef } from 'react'
import classNames from 'classnames'
import { Tween, PlayState, Timeline } from 'react-gsap'
import { useSize } from 'ahooks'
import { Button } from 'antd'

import { l, ImgProps, VideoProps } from '@/components/lazyLoader'
import ModelCenterText, { ModelCenterTextProps } from '@/components/modelCenterText'
import { VisibleComponent } from '@/components/learnMore'

import { evaluateCalc, getDocument } from '@/utils'

import styles from './index.module.less'

type Repeat<T, C extends number, U extends any[] = []> =
  U['length'] extends C ? U : Repeat<T, C, [...U, T]>

type DisplayerProps = ((ImgProps & { type?: 'img'}) | (VideoProps & { type?: 'video' })) & {
  isNeedScale?: boolean
}

interface ModelLearnMoreProps {
  modelCenterTextProps: ModelCenterTextProps
  displayersProps: Repeat<DisplayerProps, 3>
  progress?: number
  className?: string
  onSetVisibleComponent?: Dispatch<SetStateAction<VisibleComponent>>
}

const ModelLearnMore = ({
  modelCenterTextProps,
  displayersProps,
  progress = 0,
  className,
  onSetVisibleComponent
}: ModelLearnMoreProps) => {
  const getFromProps = () => {
    const startBottom = 'calc((100vh - var(--top-menu-height) - 35.72916667rem) / 2 / 2)'
    const startRight = 'calc((100vw - 71.875rem - 0.520833rem) / 2 / 2)'

    return {
      // 满屏高度减去顶部菜单减去外部容器高度，然后除以 2，得到下边距高度，最后还要由于外层放大，还要除以 2
    // bottom: 'calc(0px - (100vh - var(--top-menu-height) - 35.72916667rem) / 2 / 2)',
    // right: 'calc(0px - (100vw - 71.875rem) / 2 / 2)',
      bottom: `-${evaluateCalc(startBottom)}px`,
      right: `-${evaluateCalc(startRight)}px`,
      width: 'calc(100vw - 0.520833rem)',
      height: '100vh',
      scale: 0.5
    }
  }

  const tweenRef = useRef(null)
  const size = useSize(getDocument()?.documentElement)
  useEffect(() => {
    if (!tweenRef.current) {
      return
    }
    // @ts-expect-error
    tweenRef.current.getGSAP().vars = {
      // @ts-expect-error
      ...tweenRef.current.getGSAP().vars,
      startAt: getFromProps()
    }
  }, [size])

  const timerRef = useRef<NodeJS.Timeout>()
  // 触发型动画，需要延迟控制组件的可见性，否则动画播放不全
  useEffect(() => {
    if (progress >= 0) {
      onSetVisibleComponent && onSetVisibleComponent('ModelLearnMore')
    } else {
      timerRef.current = setTimeout(() => {
        onSetVisibleComponent && onSetVisibleComponent('JsmpegPlayer')
      }, 800)
    }
    return () => {
      timerRef.current && clearTimeout(timerRef.current)
    }
  }, [progress])

  const { buttonText, ...rest } = modelCenterTextProps
  return (
    <div className={className}>
      <div className={classNames('full-page-with-top-menu', styles.container)}>
        <Tween
          from={{
            scale: 2
          }}
          duration={0.8}
          playState={progress > 0 ? PlayState.play : PlayState.reverse}
        >
          <div className={classNames('body', styles.body)}>
            <ModelCenterText
              className={styles.titleContainer}
              {...rest}
            />
            <div className={styles.displayerContainer}>
              {
                displayersProps.map((item, index) => {
                  const {
                    type = 'img',
                    isNeedScale,
                    ...rest
                  } = item
                  const Component = l[type]
                  if (isNeedScale) {
                    return (
                      <Timeline
                        playState={progress > 0 ? PlayState.play : PlayState.reverse}
                        target={
                          <>
                            <div className={styles[`displayerContainer${index + 1}`]}>
                              {/* @ts-expect-error */}
                              <Component
                                className={styles.displayer}
                                {...rest}
                              />
                            </div>
                          </>
                        }
                      >
                        <Tween
                          ref={tweenRef}
                          from={getFromProps()}
                          to={{
                            width: '23.65rem',
                            height: '13.33rem',
                            bottom: 0,
                            right: 0,
                            scale: 1
                          }}
                          target={0}
                        />
                      </Timeline>
                    )
                  }
                  return (<div className={styles[`displayerContainer${index + 1}`]}>
                    {/* @ts-expect-error */}
                    <Component
                      className={styles.displayer}
                      {...rest}
                    />
                  </div>)
                })
              }
            </div>
            <Button
              type="primary"
              className={styles.button}
            >
              {buttonText}
            </Button>
          </div>
        </Tween>
      </div>
    </div>
  )
}

export default ModelLearnMore
