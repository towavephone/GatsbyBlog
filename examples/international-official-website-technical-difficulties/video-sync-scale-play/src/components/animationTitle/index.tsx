import React, {
  CSSProperties,
  ReactNode,
  Children,
  useContext,
  useRef,
  useEffect
} from 'react'
import classnames from 'classnames'
import { Tween, PlayState } from 'react-gsap'
import { useInViewport } from 'ahooks'

import XIcon from '../xIcon'
import ConfigContext from '../layout/configContext'

import { delayFunc } from '../../utils'

import PageStyles from './index.module.less'

export interface AnimationTitleProps {
  className?: string;
  title?: ReactNode;
  subTitle?: ReactNode;
  closeIcon?: ReactNode;
  delay?: number;
  style?: CSSProperties;
  animation?: boolean;
  isOnce?: boolean;
  titleStyle?: CSSProperties;
  closeIconStyle?: CSSProperties;
}

export const defaultCloseIcon = (<XIcon
  name='title-x'
/>)

const AnimationTitle = (props: AnimationTitleProps) => {
  const {
    className,
    title,
    subTitle,
    closeIcon = defaultCloseIcon,
    delay = 300,
    style,
    animation = true,
    isOnce = false,
    closeIconStyle,
    titleStyle,
  } = props

  const { isRunMultiTime } = useContext(ConfigContext)
  const closeIconRef = useRef(null)
  const titleRef = useRef(null)
  const subTitleRef = useRef(null)

  const domRef = useRef<HTMLDivElement>(null)
  const [inViewPort] = useInViewport(domRef)

  useEffect(() => {
    if (!animation) {
      return
    }
    const startAnimation = async () => {
      await delayFunc(delay)
      if (closeIcon) {
        // @ts-expect-error
        closeIconRef.current?.getGSAP().play()
      }
      await delayFunc(200)
      if (title) {
        // @ts-expect-error
        titleRef.current?.getGSAP().play()
      }
      // 等 title 动画的一半就开始运行
      await delayFunc(500)
      if (subTitle) {
        // @ts-expect-error
        await subTitleRef.current?.getGSAP().play()
      }
    }

    const reverseAnimation = () => {
      [closeIconRef, titleRef, subTitleRef].forEach((item) => {
        // @ts-expect-error
        item.current?.getGSAP().reverse()
      })
    }

    if (inViewPort) {
      startAnimation()
    } else if (isRunMultiTime && !isOnce) {
      reverseAnimation()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inViewPort, isOnce])

  let playState = animation ? PlayState.stop : PlayState.stopEnd

  return (
    <div
      className={classnames(
        PageStyles.textDisplay,
        'text-display',
        className
      )}
      style={style}
      ref={domRef}
    >
      {
        closeIcon && <Tween
          ref={closeIconRef}
          from={{
            opacity: 0,
            rotate: -100
          }}
          to={{
            opacity: 1,
            rotate: 0
          }}
          playState={playState}
        >
          <div
            className={classnames(PageStyles.closeIcon, 'close-icon')}
            style={closeIconStyle}
          >
            {closeIcon}
          </div>
        </Tween>
      }
      {
        title && <Tween
          ref={titleRef}
          from={{
            scale: 0,
            opacity: 0
          }}
          to={{
            opacity: 1,
            scale: 1
          }}
          playState={playState}
        >
          <div
            className={classnames(
              PageStyles.title,
              'text-display-title'
            )}
            style={titleStyle}
          >
            {title}
          </div>
        </Tween>
      }
      {
        subTitle && <div
          className={classnames(
            PageStyles.subTitleContainer,
            'text-display-sub-title-container'
          )}
        >
          <Tween
            ref={subTitleRef}
            from={{
              opacity: 0,
              y: 50
            }}
            to={{
              opacity: 1,
              y: 0
            }}
            stagger={0.6}
            duration={Children.toArray(subTitle).length * 0.4}
            playState={playState}
          >
            {
              Children.toArray(subTitle).map((item: any, index: number) => {
                return (
                  <div
                    className={classnames(
                      PageStyles.subTitle,
                      'text-display-sub-title'
                    )}
                    key={index}
                  >
                    {item}
                  </div>
                )
              })
            }
          </Tween>
        </div>
      }
    </div>
  )
}

export default AnimationTitle
