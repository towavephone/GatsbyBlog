---
title: 国际官网技术难点攻关
categories:
   - 前端
path: /international-official-website-technical-difficulties/
tags: 前端, 国际官网, 预研
date: 2022-3-14 16:04:24
draft: true
---

# 需求背景

完成官网 1.0 的上线，实现动效、多语言、多平台适配等等功能

# 动效

## 逐行显示

### 需求背景

实现如下所示动效，看到就执行一次

<video src="/examples/international-official-website-technical-difficulties/line-by-line-display.mp4" loop muted autoplay width="100%"></video>

### 选型过程

| 选型 | 优点 | 缺点 |
| :-- | :-- | :-- |
| [react-spring](https://github.com/pmndrs/react-spring) | 使用方便，基于弹簧物理的动画库 | <ol><li>改变 state 会导致多次执行</li><li>不能自由控制播放进度</li></ol> |
| [animate.css](https://animate.style/) | 原生方法体积小，提供回退兼容性好 | 使用较为繁琐，需要同时写 css、js |
| [gsap](https://github.com/greensock/GSAP) | <ol><li>可控制播放进度或自动播放，可配合之后提到的 react-scrollmagic 实现动效进度控制</li><li>示例丰富，可实现很多动效</li></ol> | api 过于原始，需要封装 |
| [react-gsap](https://github.com/bitworking/react-gsap) | 除了以上优点，可直接在 react 中使用 | 有些 gsap 动效不能直接在 react-gsap 中使用，比如说和 react-scrollmagic 相同的效果 |

### 核心代码

#### react-spring

最初采用 react-spring 版本，主要实现了如下功能

1. react-spring 时间序列化（react-spring ref delay）
2. useContext 全局控制，实现 react-spring 的反向动画

```tsx
import React, { CSSProperties, ReactNode, Children, useRef, useEffect, useContext } from 'react';
import classnames from 'classnames';
import { a, useTransition, useSpringRef, useSpring } from '@react-spring/web';
import { useInViewport } from 'ahooks';

import XIcon from '@/components/xIcon';
import ConfigContext from '@/components/layout/configContext';

import { delayFunc } from '@/utils';

import PageStyles from './index.module.less';

export interface AnimationTitleProps {
   className?: string;
   title?: ReactNode;
   subTitle?: ReactNode;
   closeIcon?: ReactNode;
   delay?: number;
   style?: CSSProperties;
   animation?: boolean;
   isOnce?: boolean;
}

type TransitionProps = Parameters<typeof useTransition>[1];

const AnimationTitle = ({
   className,
   title,
   subTitle,
   closeIcon = <XIcon name='title-x' />,
   delay = 300,
   style,
   animation = true,
   isOnce = false
}: AnimationTitleProps) => {
   const { isRunMultiTime } = useContext(ConfigContext);

   const closeIconRef = useSpringRef();
   const closeIconStyle = useSpring({
      ref: closeIconRef,
      from: {
         opacity: 0,
         rotate: -100
      },
      to: {
         rotate: 0,
         opacity: 1
      }
   });

   const titleRef = useSpringRef();
   const titleStyle = useSpring({
      ref: titleRef,
      from: {
         scale: 0,
         opacity: 0
      },
      to: {
         scale: 1,
         opacity: 1
      },
      config: {
         tension: 100,
         friction: 14
      }
   });

   const renderSubTitle: ReactNode[] = Children.map(Children.toArray(subTitle), (child, index) => {
      if (typeof child === 'string') {
         return <div key={index}>{child}</div>;
      }
      return child;
   });

   const subTitleRef = useSpringRef();
   const transitionProps: TransitionProps = {
      from: {
         opacity: 0,
         y: 50
      },
      enter: (msg, i) => ({
         delay: () => {
            return i * 400;
         },
         to: {
            opacity: 1,
            y: 0
         }
      }),
      ref: subTitleRef
   };

   if (!isRunMultiTime || isOnce) {
      transitionProps.keys = (item: { key: any }) => item.key;
   }

   const transitions = useTransition(renderSubTitle, transitionProps);

   const domRef = useRef<HTMLDivElement>(null);
   const [inViewPort] = useInViewport(domRef);
   useEffect(() => {
      const startAnimation = async () => {
         await delayFunc(delay);
         if (closeIcon) {
            closeIconRef.start();
         }
         if (title) {
            await Promise.all(titleRef.start());
         }
         if (subTitle) {
            await Promise.all(subTitleRef.start());
         }
      };

      const reverseAnimation = () => {
         [closeIconRef, titleRef, subTitleRef].forEach((item) => {
            item.start({
               reverse: true
            });
         });
      };

      if (inViewPort) {
         startAnimation();
      } else if (isRunMultiTime && !isOnce) {
         reverseAnimation();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [inViewPort, isOnce, title, subTitle]);

   const getStyle = (style: any) => (animation ? style : undefined);

   return (
      <div ref={domRef} className={classnames(PageStyles.textDisplay, 'text-display', className)} style={style}>
         {closeIcon && (
            <a.div style={getStyle(closeIconStyle)} className={classnames(PageStyles.closeIcon, 'close-icon')}>
               {closeIcon}
            </a.div>
         )}
         {title && (
            <a.div style={getStyle(titleStyle)} className={classnames(PageStyles.title, 'text-display-title')}>
               {title}
            </a.div>
         )}
         {subTitle && (
            <div className={classnames(PageStyles.subTitleContainer, 'text-display-sub-title-container')}>
               {transitions((style, item: any) => {
                  return (
                     <a.div
                        style={getStyle(style)}
                        className={classnames(PageStyles.subTitle, 'text-display-sub-title')}
                     >
                        {item}
                     </a.div>
                  );
               })}
            </div>
         )}
      </div>
   );
};

export default AnimationTitle;
```

#### react-gsap

为了解决渲染多次组件带来的多次执行动效的问题，之后采用 react-gsap 实现

```tsx
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

import XIcon from '@/components/xIcon'
import ConfigContext from '@/components/layout/configContext'

import useStoreContext, { CLIENT_TYPE } from '@/hooks/useStoreContext'

import { delayFunc } from '@/utils'

import PageStyles from './index.module.less'

export interface AnimationTitleProps {
  className?: string
  title?: ReactNode
  subTitle?: ReactNode
  closeIcon?: ReactNode
  delay?: number
  style?: CSSProperties
  animation?: boolean
  isOnce?: boolean
  titleStyle?: CSSProperties
  closeIconStyle?: CSSProperties
  reverseAnimationRef?: any
  startAnimationRef?: any
}

export const defaultCloseIcon = (<XIcon
  name='title-x'
/>)

// TODO 移动端关闭动效

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
    reverseAnimationRef = null,
    startAnimationRef = null
  } = props

  const { isRunMultiTime } = useContext(ConfigContext)
  const closeIconRef = useRef(null)
  const titleRef = useRef(null)
  const subTitleRef = useRef(null)

  const domRef = useRef<HTMLDivElement>(null)
  const [inViewPort] = useInViewport(domRef)

  const { state } = useStoreContext()

  useEffect(() => {
    if (!animation || state?.clientType === CLIENT_TYPE.H5) {
      return
    }
    const startAnimation = async () => {
      await delayFunc(delay)
      if (closeIcon) {
        closeIconRef.current?.getGSAP().play()
      }
      await delayFunc(200)
      if (title) {
        titleRef.current?.getGSAP().play()
      }
      // 等 title 动画的一半就开始运行
      await delayFunc(500)
      if (subTitle) {
        await subTitleRef.current?.getGSAP().play()
      }
    }

    const reverseAnimation = () => {
      [closeIconRef, titleRef, subTitleRef].forEach((item) => {
        item.current?.getGSAP().reverse()
      })
    }

    if (reverseAnimationRef) {
      reverseAnimationRef.current = reverseAnimation
    }

    if (startAnimationRef) {
      startAnimationRef.current = startAnimation
    }

    if (inViewPort) {
      startAnimation()
    } else if (isRunMultiTime && !isOnce) {
      reverseAnimation()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inViewPort, isOnce])

  let playState = animation ? PlayState.stop : PlayState.stopEnd

  // animation 未定义且是 h5 的情况下，去掉动效
  if (state?.clientType === CLIENT_TYPE.H5) {
    playState = PlayState.stopEnd
  }

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
```

### 运行效果

#### react-spring

#### react-gsap

## 数字滚动展示

### 需求背景

实现如下所示动效，看到就执行一次

<video src="/examples/international-official-website-technical-difficulties/number-change-display.mp4" loop muted autoplay width="100%"></video>

### 选型过程

同 `逐行显示` 的选型过程，这里使用的是 react-spring

### 核心代码

```tsx
import React, { ReactNode, useRef, useEffect } from 'react';
import classnames from 'classnames';
import { a, useTrail, useSprings, useSpringRef } from '@react-spring/web';
import { useInViewport } from 'ahooks';

import { delayFunc } from '@/utils';

import PageStyles from './index.module.less';

interface TitleContent {
   title: string;
}

interface NumberContent {
   number: string;
   unit: string;
   precision?: number;
   render?: (value: number) => string;
}

interface CommonDataItem {
   hint: string;
}

type DataItem = CommonDataItem & (TitleContent | NumberContent);

interface Props {
   data: DataItem[];
   className?: string;
   delay?: number;
}

const CarConfiguration = ({ data, className, delay = 300 }: Props) => {
   const [trails, trailsApi] = useTrail(data.length, () => ({
      opacity: 0,
      y: 40
   }));

   const springsRef = useSpringRef();
   const springs = useSprings(
      data.length,
      data.map((item) => ({
         ref: springsRef,
         from: {
            number: 0
         },
         to: {
            number: Number((item as NumberContent).number)
         }
      }))
   );

   const domRef = useRef();
   const [inViewPort] = useInViewport(domRef);
   useEffect(() => {
      const startAnimation = async () => {
         await delayFunc(delay);
         trailsApi.start({
            y: 0,
            opacity: 1
         });
         await delayFunc(1200);
         springsRef.start();
      };

      const reverseAnimation = () => {
         trailsApi.start({
            y: 40,
            opacity: 0
         });
         [springsRef].forEach((item) => {
            item &&
               item.start({
                  reverse: true
               });
         });
      };

      if (inViewPort) {
         startAnimation();
      } else {
         reverseAnimation();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [inViewPort]);

   return (
      <div ref={domRef} className={classnames(PageStyles.configuration, className, 'car-configuration')}>
         {trails.map((style, index) => {
            const item = data[index];
            let title: ReactNode = (item as TitleContent).title;
            const titleComponent = (
               <>
                  <span
                     className={PageStyles.configurationTitle}
                     key={Math.random()}
                     dangerouslySetInnerHTML={{ __html: (item as TitleContent).title }}
                  />
                  <span
                     className={PageStyles.unit}
                     key={Math.random()}
                     dangerouslySetInnerHTML={{ __html: (item as any).unit }}
                  />
               </>
            );
            const numberItem = item as NumberContent;
            if (!title && numberItem.number) {
               const renderFunc = numberItem.render
                  ? numberItem.render
                  : (value: number) => value.toFixed(numberItem.precision || 0);
               title = (
                  <>
                     <a.span>{springs[index].number.to(renderFunc)}</a.span>
                     <span
                        className={PageStyles.unit}
                        key={Math.random()}
                        dangerouslySetInnerHTML={{ __html: numberItem.unit }}
                     />
                  </>
               );
            }
            return (
               <>
                  <a.div
                     key={index}
                     className={classnames(PageStyles.configurationItem, 'car-configuration-item')}
                     style={style}
                  >
                     {typeof title === 'string' ? (
                        titleComponent
                     ) : (
                        <div className={PageStyles.configurationTitle}>{title} </div>
                     )}
                     <div className={PageStyles.configurationHint}>{item.hint}</div>
                  </a.div>
                  {index < trails.length - 1 && <a.div key={index} className={PageStyles.divider} style={style} />}
               </>
            );
         })}
      </div>
   );
};

export default CarConfiguration;
```

### 运行效果

## 视频进度同步 / 缩放动效

### 需求背景

实现如下所示的动效，实现要点如下：

1. 视频在视口范围内只会播放一次，完全离开视口重置播放进度，且完全进入视口时才会播放视频
2. 由 2 个视频拼接而成，触发缩放的瞬间进度需要同步（在视频未播放完成的情况下需要同步）
3. 过渡时需要使用 visibility 来控制显隐

<video src="/examples/international-official-website-technical-difficulties/video-sync-scale-play.mp4" loop muted autoplay width="100%"></video>

### 选型过程

同 `逐行显示` 的选型过程

### 核心代码

web/pages/p7/components/learnMore/index.tsx

```tsx
import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
  const getValue = (param: string) => t(`p7.learnMore.${param}`)

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
    srcPoster: '/public/p7/learn-more/p7-wing@mini.jpg',
    src: '/public/p7/learn-more/p7-wing-origin-fast.mp4'
  }

  if (state?.clientType === CLIENT_TYPE.PC) {
    miniVideoProps = {
      ...miniVideoProps,
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
          src="/public/p7/learn-more/p7-wing-origin-fast.mp4"
          className={classNames(styles.player, visibleComponent !== 'JsmpegPlayer' ? styles.hidden : '')}
        />
      }
      <ModelLearnMore
        className={state?.clientType === CLIENT_TYPE.PC && visibleComponent !== 'ModelLearnMore' ? styles.hidden : ''}
        progress={state?.clientType === CLIENT_TYPE.PC ? modelLearnMoreProgress : 100}
        modelCenterTextProps={{
          topSubTitle: getValue('topSubTitle'),
          title: getValue('title'),
          subTitle: getValue('subTitle'),
          shortDesc: getValue('shortDesc'),
          buttonText: getValue('button'),
          animation: state?.clientType === CLIENT_TYPE.H5
        }}
        onSetVisibleComponent={setVisibleComponent}
        displayersProps={[
          {
            src: '/public/p7/learn-more/p7-p2-1.jpg',
            srcSet: '/public/p7/learn-more/p7-p2-1@2x.jpg'
          },
          {
            src: '/public/p7/learn-more/p7-p2-2.jpg',
            srcSet: '/public/p7/learn-more/p7-p2-2@2x.jpg',
            minSrcSet: '/public/p7/learn-more/p7-p2-2@mini.jpg'
          },
          miniVideoProps
        ]}
        itemList={[
          {
            imgList: [{
              src: '/public/p7/d1/P7-d1-1-3.jpg',
              srcSet: '/public/p7/d1/P7-d1-1-3@2x.jpg'
            }, {
              src: '/public/p7/d1/P7-d1-1-1.jpg',
              srcSet: '/public/p7/d1/P7-d1-1-1@2x.jpg'
            }, {
              src: '/public/p7/d1/P7-d1-1-2.jpg',
              srcSet: '/public/p7/d1/P7-d1-1-2@2x.jpg'
            }],
            background: 'linear-gradient(133deg, #343538 0%, #000102 100%)',
            textData: {
              topSubTitle: t('p7.d1.topSubTitle1'),
              title: t('p7.d1.title1'),
              subTitle: t('p7.d1.subTitle1')
            }
          },
          {
            imgList: [{
              src: '/public/p7/d1/P7-d1-2-3.jpg',
              srcSet: '/public/p7/d1/P7-d1-2-3@2x.jpg'
            }, {
              src: '/public/p7/d1/P7-d1-2-1.jpg',
              srcSet: '/public/p7/d1/P7-d1-2-1@2x.jpg'
            }, {
              src: '/public/p7/d1/P7-d1-2-2.jpg',
              srcSet: '/public/p7/d1/P7-d1-2-2@2x.jpg'
            }],
            background: 'linear-gradient(133deg, #B6CBDA 0%, #7A97AF 100%)',
            textData: {
              topSubTitle: t('p7.d1.topSubTitle2'),
              title: t('p7.d1.title2'),
              subTitle: t('p7.d1.subTitle2')
            }
          },
          {
            imgList: [{
              src: '/public/p7/d1/P7-d1-3-1.mp4'
            }, {
              src: '/public/p7/d1/P7-d1-3-2.jpg',
              srcSet: '/public/p7/d1/P7-d1-3-2@2x.jpg'
            }],
            background: 'linear-gradient(133deg, #343538 0%, #000102 100%)',
            textData: {
              topSubTitle: t('p7.d1.topSubTitle3'),
              title: t('p7.d1.title3'),
              subTitle: t('p7.d1.subTitle3')
            }
          }
        ]}
      />
    </div>
  )
}

export default Index
```

web/pages/p7/components/modelLearnMore/index.tsx

```tsx
import React, { useEffect, useState, Dispatch, SetStateAction, useRef } from 'react'
import classNames from 'classnames'
import { Tween, PlayState, Timeline } from 'react-gsap'
import { useSize } from 'ahooks'

import { l, ImgProps, VideoProps } from '@/components/lazyLoader'
import XButton from '@/components/xButton'
import ModelCenterText, { ModelCenterTextProps } from '@/components/modelCenterText'
import AnimationBg from '@/components/animationBg'

import useTmpComponent, { ImgAndTextSwiperProps } from '@/hooks/useTmpComponent'

import { evaluateCalc, getDocument } from '@/utils'

import { VisibleComponent } from '../../components/learnMore'

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
  itemList = [],
  progress = 0,
  className,
  onSetVisibleComponent
}: ModelLearnMoreProps & ImgAndTextSwiperProps) => {
  const { api, Slot } = useTmpComponent()

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

    tweenRef.current.getGSAP().vars = {
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
    <AnimationBg type={1} className={className}>
      <Slot
        itemList={itemList}
        pageType = 'P7Wing'
        modelType='P7'
        buttonType='LearnMore'
      />
      <div ref={ref} className={classNames('full-page-with-top-menu', styles.container)}>
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
                    <Component
                      className={styles.displayer}
                      {...rest}
                    />
                  </div>)
                })
              }
            </div>
            <XButton
              type="primary"
              className={styles.button}
              onClick={() => {
                api.current?.open()
              }
              }
            >
              {buttonText}
            </XButton>
          </div>
        </Tween>
      </div>
    </AnimationBg>
  )
}

export default ModelLearnMore
```

### 优化

#### 计算 calc 的实际 px 值

web/utils/index.ts

```ts
// 只支持计算值为正值
export const evaluateCalc = (expression: string, container = getDocument()?.body) => {
  // 不能加以下代码，影响动效
  // if (!container || !Object.keys(container).length) {
  //   return 0
  // }
  if (!__isBrowser__) {
    return 0
  }
  const el = document.createElement('div')
  el.style.position = 'absolute'
  el.style.visibility = 'hidden'
  el.innerHTML = `<div style="width: ${expression}"></div>`
  container.insertBefore(el, container.firstChild)
  const calcPx = el.clientWidth
  container.removeChild(el)
  return calcPx
}
```

#### p7 resize 后动画定位不准的 bug

### 运行效果

## 固定页面滚动控制

### 需求背景

实现如下所示的动效，随着鼠标滚轮滚动而触发的动效

<video src="/examples/international-official-website-technical-difficulties/fix-page-scroll-display.mp4" loop muted autoplay width="100%"></video>

### 选型过程

1. scrollMagic
2. react-scrollmagic
3. react-gsap + scrollTrigger
4. gsap + scrollTrigger

### 核心代码

```tsx
import React from 'react'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { Tween, PlayState } from 'react-gsap'

import { l } from '@/components/lazyLoader'
import ModelLeftText from '@/components/modelLeftText'
import { SceneProps } from '@/components/reactScrollMagic'
import AnimationBg from '@/components/animationBg'

import useTmpComponent from '@/hooks/useTmpComponent'

import { getAnimateProgresses } from '@/utils/animate'

import styles from './index.module.less'

const Index = ({
  sceneParams
}: SceneProps) => {
  const {
    progress = 0
  } = sceneParams || {}
  const { t } = useTranslation()
  const getValue = (param: string) => t(`p7.sepa.${param}`)

  const { api, Slot } = useTmpComponent()

  const [animationTextProgress] = getAnimateProgresses(progress, [
    {
      start: 1 / 2,
      duration: 1 / 2
    }
  ])

  return (
    <l.div
      src="/public/p7/sepa/p7-p4-1.jpg"
      minSrcSet="/public/p7/sepa/p7-p4-1@mini.jpg"
      srcSet="/public/p7/sepa/p7-p4-1@2x.jpg"
      className={classNames('global-full-page-with-top-menu', styles.container)}
    >
      <Slot
        modelType='P7'
        pageType='SEPA'
        buttonType='Arrow'
        itemList={[{
          imgList: [{
            src: '/public/p7/d3/P7-d3-1.png',
            srcSet: '/public/p7/d3/P7-d3-1@2x.jpg'
          }],
          background: 'linear-gradient(133deg, #343538 0%, #000102 100%)',
          textData: {
            topSubTitle: t('p7.d3.topSubTitle1'),
            title: t('p7.d3.title1'),
            subTitle: t('p7.d3.subTitle1')
          }
        }, {
          imgList: [{
            src: '/public/p7/d3/P7-d3-2.jpg',
            srcSet: '/public/p7/d3/P7-d3-2@2x.jpg'
          }],
          background: 'linear-gradient(133deg, #343538 0%, #000102 100%)',
          textData: {
            topSubTitle: t('p7.d3.topSubTitle2'),
            title: t('p7.d3.title2'),
            subTitle: t('p7.d3.subTitle2')
          }
        }]}
      />
      <div ref={trackRef} className={classNames('body', styles.body)}>
        <ModelLeftText
          topSubTitle={getValue('topSubTitle')}
          title={getValue('title')}
          subTitle={getValue('subTitle')}
          shortDesc={getValue('shortDesc')}
          buttonProps={{
            onClick: () => {
              api.current?.open()
            },
            type: 'ghost'
          }}
        />
      </div>
      {
        animationTextProgress > 0 && <AnimationBg type={2} className={styles.animationBg}>
          <Tween
            from={{
              scale: 40
            }}
            totalProgress={animationTextProgress}
            playState={PlayState.pause}
          >
            <div className={styles.animationText}>
              {/* 这里所有国家都是这个，不需要国际化 */}
              XPILOT
            </div>
          </Tween>
        </AnimationBg>
      }
    </l.div>
  )
}

export default Index
```

### 运行效果

## 序列帧滚动控制

### 需求背景

实现如下所示动效，随着鼠标滚轮滚动播放视频或图片

<video src="/examples/international-official-website-technical-difficulties/video-frame-scroll-control.mp4" loop muted autoplay width="100%"></video>

### 选型过程

#### 视频方向

1. video + av01、vp9、h264 编码的 mp4 视频（av01、vp9、h264 编码一一尝试，随着文件体积的增加，解码性能逐渐增加，但以 UI 给的视频素材测试 h264 在某些电脑比如苹果电脑上还是卡顿；在此过程中一旦使用 ffmpeg 压缩 UI 给的视频素材会导致卡顿，暂时未知是解码性能的原因还是使用了 currentTime 无法跳转到指定帧，只能跳转到关键帧，而关键帧之间并不是连续的流畅画面，fps 不平均的原因）
2. ogv.js + vp9 编码的 webm 视频（解码速度较慢导致卡顿、随机跳转会报错且视频会卡住）
3. 提前将 video 的每一帧预渲染，可能效率较低，导致浏览器卡住，相关库：[frame-grab](https://github.com/rnicholus/frame-grab.js)、[video-frame-previewer](https://github.com/wch1n/video-frame-previewer)、[capture-frame](https://github.com/feross/capture-frame)
4. jsmpeg + mpeg1 编码的 mpeg 视频（最新版本得不到总帧数、无法实现帧寻址、采用 ts 流导致不能立马跳转成功、实际使用 currentTime 无法跳成功等等缺点，故使用 v0.2 实现。缺点：同等画质下体积较大；颜色范围有限制 16~235，即不能纯白纯黑。优点：解码速度满足要求）

   ```bash
   # ts 压缩
   ffmpeg -i demo.mp4 -f mpegts -codec:v mpeg1video -b:v 1024k -bf 0 -r 20 -an demo@1024.ts

   ffmpeg -i demo.mp4 -f mpeg1video -codec:v mpeg1video -b:v 1200k -bf 0 -r 20 -an demo.mpeg

   # mpeg 压缩
   ffmpeg -i demo.mp4 -f mpeg1video -codec:v mpeg1video -b:v 2048k -bf 0 -r 30 -an demo@2048.mpeg

   ffmpeg -i demo.mp4 -f mpeg1video -codec:v mpeg1video -b:v 2048k -maxrate:v 2048k -minrate:v 2048k -r 30 -an demo@2048.mpeg

   # mp4 压缩
   ffmpeg -i p7-p3-1.mp4 -b:v 2048k -bf 0 -r 25 -an p7-p3-1@2048.mp4

   ffmpeg -i p7-p3-1.mp4 -b:v 2048k -maxrate:v 2048k -minrate:v 2048k -r 25 -an p7-p3-1@2048.mp4

   ffmpeg -i p7-p3-1.mp4 -b:v 2048k -maxrate:v 2048k -minrate:v 2048k -r 25 -an -movflags faststart p7-p3-1@2048.mp4

   # 批量压缩
   #!/bin/bash
   for i in *.mp4
   do
      echo "File $i selected"
      # ffmpeg -i "$i" "$i.mp3"
      ffmpeg -i "$i" -b:v 2048k -maxrate:v 2048k -minrate:v 2048k -r 25 -an -movflags faststart "$i.mp4"
   done
   ```

#### 图片方向

1. 预加载所有图片 + 图片序列帧（参考张博客，体积较大）
2. pixi-apngAndGif，使用 apng 控制播放进度（体积太大）
3. 针对方案 1，使用 avif + avif.js，暂时未知解码性能如何，猜测同样都是 av1 解码，可能解码性能不行；
4. 针对方案 1，使用 webp，解码性能同样可能不行
5. 针对方案 1，使用 jpg

### 核心代码

web/components/jsmpegPlayer/index.tsx

```tsx
import React, { useRef, useEffect, useState } from 'react'
import classNames from 'classnames'
import { useInViewport, useAsyncEffect } from 'ahooks'

import { l } from '@/components/lazyLoader'

import { loadScript } from '@/utils'

import styles from './index.module.less'

interface JsmpegPlayerProps {
  src: string
  progress?: number // 播放进度，0~1
  className?: string
  poster?: string
}

// https://github.com/phoboslab/jsmpeg/tree/v0.2
const JsmpegPlayer = ({
  src,
  progress,
  className,
  poster,
  ...rest
}: JsmpegPlayerProps) => {
  const [isLoad, setIsLoad] = useState(true)
  const [isLoadJsmpeg, setIsLoadJsmpeg] = useState(true)
  const playerRef = useRef()
  const domRef = useRef(null)

  useAsyncEffect(async () => {
    await loadScript('/public/lib/jsmpeg.min.js')
    setIsLoadJsmpeg(false)
  }, [])

  const [inViewPort] = useInViewport(domRef)
  useEffect(() => {
    if (!inViewPort || isLoadJsmpeg || !isLoad) {
      return
    }
    // eslint-disable-next-line new-cap
    playerRef.current = new window.jsmpeg(src, {
      ...rest,
      canvas: domRef.current?.querySelector('canvas'),
      seekable: true,
      onload: () => {
        setIsLoad(false)
        // console.log(playerRef.current?.duration, playerRef.current?.frameCount)
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inViewPort, isLoadJsmpeg])

  useEffect(() => {
    if (isLoad || typeof progress !== 'number') {
      return
    }
    const calcProgress = progress < 0 ? 0 : progress > 1 ? 1 : progress
    const frameCount = playerRef.current?.frameCount - 1 // 最大帧需减一
    playerRef.current?.seekToFrame(calcProgress * frameCount, true)
  }, [progress, isLoad])

  const isShowPoster = (isLoad || isLoadJsmpeg) && poster
  return <div
    ref={domRef}
    className={classNames(styles.container, className)}
  >
    <div className={styles.body}>
      <canvas
        className={styles.video}
      />
      {
        isShowPoster && <l.img
          src={poster}
          className={styles.poster}
        />
      }
    </div>
  </div>
}

export default JsmpegPlayer
```

web/pages/p5/components/smartSpaceInternal/index.tsx

```tsx
import React from 'react'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'

import ModelCenterText from '@/components/modelCenterText'
import ModelLeftText from '@/components/modelLeftText'
import { SceneProps } from '@/components/reactScrollMagic'
import JsmpegPlayer from '@/components/jsmpegPlayer'
import { l } from '@/components/lazyLoader'

import useTmpComponent from '@/hooks/useTmpComponent'
import useStoreContext, { CLIENT_TYPE, DATA_ANALYSIS_TYPES } from '@/hooks/useStoreContext'

import { getAnimateProgresses } from '@/utils/animate'

import styles from './index.module.less'
import { dataAnalysisClickTrack } from '@/utils/dataAnalysis'
import XTracker from '@/components/xTracker'
import { setDataLayer } from '@/hooks/useSetDataLayer'

const Index = ({
  sceneParams
}: SceneProps) => {
  const {
    progress = 0
  } = sceneParams || {}
  const { t } = useTranslation()
  const trackRef = XTracker.useExposureNode({
    type: 'P5',
    event: 'IntelligentSpace_Show'
  })
  const getValue = (param: string) => t(`p5.smartSpaceInternal.${param}`)

  const { api, Slot } = useTmpComponent()

  const { state } = useStoreContext()

  const [playerProgress] = getAnimateProgresses(progress, [
    {
      start: 0,
      duration: 2 / 3
    }
  ])

  const isShowAnimationText = playerProgress > 0.47 // 窗帘收起时文字出现

  return (
    <>
      {
        state?.clientType === CLIENT_TYPE.PC && <JsmpegPlayer
          className={styles.player}
          src="/public/p5/smart-space-internal/p5-inside.mpeg"
          poster="/public/p5/smart-space-internal/p5-inside-first-frame.jpg"
          progress={playerProgress}
        />
      }
      <div
        className={classNames('global-full-page-with-top-menu', styles.container)}
      >
        {
          state?.clientType === CLIENT_TYPE.H5 && <l.video
            className={styles.player}
            src="/public/p5/smart-space-internal/p5-inside-origin.mp4"
            srcPoster="/public/p5/smart-space-internal/p5-inside@mini.jpg"
            playIconPosition="bottom"
          />
        }
        <Slot
          modelType='P5'
          pageType='IntelligentSpace'
          buttonType='LearnMore'
          itemList={[{
            imgList: [{
              src: '/public/p5/d3/p5-d3-1.jpg',
              srcSet: '/public/p5/d3/p5-d3-1@2x.jpg'
            }],
            background: 'linear-gradient(132deg, #94A1C6 0%, #7C8DB6 100%)',
            textData: {
              topSubTitle: t('p5.d3.topSubTitle1'),
              title: t('p5.d3.title1'),
              subTitle: t('p5.d3.subTitle1')
            }
          }, {
            imgList: [{
              src: '/public/p5/d3/p5-d3-2.mp4'
            }],
            background: 'linear-gradient(136deg, #5F729E 0%, #3B4B76 100%)',
            textData: {
              topSubTitle: t('p5.d3.topSubTitle2'),
              title: t('p5.d3.title2'),
              subTitle: t('p5.d3.subTitle2')
            }
          }, {
            imgList: [{
              src: '/public/p5/d3/p5-d3-3.jpg',
              srcSet: '/public/p5/d3/p5-d3-3@2x.jpg'
            }],
            background: 'linear-gradient(133deg, #B6CBDA 0%, #7A97AF 100%)',
            textData: {
              topSubTitle: t('p5.d3.topSubTitle3'),
              title: t('p5.d3.title3'),
              subTitle: t('p5.d3.subTitle3')
            }
          }]}
        />
        <div ref={trackRef} className={classNames('body', styles.body)}>
          {
            isShowAnimationText && state?.clientType === CLIENT_TYPE.PC && <ModelCenterText
              topSubTitle={getValue('topSubTitle')}
              title={getValue('title')}
              subTitle={getValue('subTitle')}
              shortDesc={getValue('shortDesc')}
              buttonText={getValue('button')}
              buttonProps={{
                onClick: () => {
                  dataAnalysisClickTrack(`${DATA_ANALYSIS_TYPES.P5}_IntelligentSpace_LearnMoreBtn`)
                  api?.current?.open()
                  setDataLayer({
                    event_category: 'click_button',
                    car_model: 'p5',
                    button_group: 'learn more',
                    click_text: getValue('button')
                  })
                },
                type: 'ghost',
                dark: true,
                plain: true
              }}
              closeIcon={null}
            />
          }
          {
            state?.clientType === CLIENT_TYPE.H5 && <ModelLeftText
              topSubTitle={getValue('topSubTitle')}
              title={getValue('title')}
              subTitle={getValue('subTitle')}
              shortDesc={getValue('shortDesc')}
              buttonProps={{
                onClick: () => {
                  // TODO 这里是用learn more还是用arrow
                  api?.current?.open()
                },
                type: 'ghost'
              }}
              closeIcon={null}
            />
          }
        </div>
      </div>
    </>

  )
}

export default Index
```

### 运行效果

### 优化

#### 视频压缩

视频批量压缩脚本、支持单个压缩（有声音、转 mpeg 单独压缩）

scripts/compress.mjs

```js
#!/usr/bin/env zx
const { get } = require('lodash');

const compressConfig = require('../compress.config');
const concurrentRun = require('./concurrentRun');

// 关闭日志输出
$.verbose = false;

const FILE_SUFFIX = 'mp4';
const TMP_FILE_SUFFIX = '.bak.mp4';

const delFiles = await globby(`public/**/*${TMP_FILE_SUFFIX}`);

await $`rm -rf ${delFiles}`;

let files = [];

const params = argv._.slice(1);
if (params.length > 0) {
   files = params.filter((item) => /mp4$/.test(item));
} else {
   files = await globby(`public/**/*.${FILE_SUFFIX}`);
}

console.log(`开始压缩 ${FILE_SUFFIX}`);

// https://github.com/google/zx/issues/126
$.noquote = async (...args) => {
   const q = $.quote;
   $.quote = (v) => v;
   const p = $(...args);
   await p;
   $.quote = q;
   return p;
};

const transformToMpeg = async (bashFunc, file) => {
   await $.noquote`${bashFunc(file, file.replace(/mp4$/, 'mpeg'))}`;
   // await $`rm -rf ${file}`
};

const transformToMp4 = async (bashFunc, file) => {
   await $.noquote`${bashFunc(file, file + TMP_FILE_SUFFIX)}`;
   await $`rm -rf ${file}`;
   await $`mv ${file}${TMP_FILE_SUFFIX} ${file}`;
   await $`rm -rf ${file}${TMP_FILE_SUFFIX}`;
};

const funcArray = [
   {
      path: 'mpeg.4',
      func: transformToMpeg
   },
   {
      path: 'mp4.hasAudio',
      func: transformToMp4
   },
   {
      path: 'mp4',
      func: transformToMp4
   }
];

await concurrentRun(
   files.map((file) => async () => {
      for (let i = 0; i < funcArray.length; i++) {
         const item = funcArray[i];
         const { bashFunc, files } = get(compressConfig.mp4, item.path);
         // files 未定义或者包含 file
         if (!files || files.includes(file)) {
            await item.func(bashFunc, file);
            return Promise.resolve();
         }
      }
      return Promise.resolve();
   })
);

console.log(`共 ${files.length} 个 ${FILE_SUFFIX} 压缩完成`);
```

scripts/concurrentRun.js

```js
const ProgressBar = require('progress');
const os = require('os');
const cpus = os.cpus();

/**
 * 执行多个异步任务
 * @param {*} fnList 任务列表
 * @param {*} max 最大并发数限制，默认执行的是 CPU 密集性任务，线程数等于 CPU 核心数 + 1
 * @param {*} taskName 任务名称
 */
module.exports = async function concurrentRun(fnList = [], max = cpus.length + 1, taskName = '未命名') {
   if (!fnList.length) return;

   console.log(`开始执行多个异步任务，最大并发数： ${max}`);
   const bar = new ProgressBar('执行中 [:bar] :rate/bps :percent :etas 第 :current 个 总共 :total 个', {
      total: fnList.length
   });

   const replyList = []; // 收集任务执行结果
   // const count = fnList.length // 总任务数量
   const startTime = new Date().getTime(); // 记录任务执行开始时间

   // let current = 0
   // 任务执行程序
   const schedule = async (index) => {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve) => {
         try {
            const fn = fnList[index];
            if (!fn) return resolve();

            // 执行当前异步任务
            const reply = await fn();
            replyList[index] = reply;
         } catch (e) {
            console.log(e);
            // 报错了不管继续下一个
            resolve();
         }

         bar.tick();
         // current++
         // console.log(
         //   `${taskName} 事务进度，第 ${current} 个，共 ${count} 个，进度为 ${((current / count) * 100).toFixed(2)}% `
         // )

         // 执行完当前任务后，继续执行任务池的剩余任务
         await schedule(index + max);
         resolve();
      });
   };

   // 任务池执行程序
   const scheduleList = new Array(max).fill(0).map((_, index) => schedule(index));
   // 使用 Promise.all 批量执行
   await Promise.all(scheduleList);

   const cost = (new Date().getTime() - startTime) / 1000;
   if (bar.complete) {
      console.log(`执行完成，最大并发数： ${max}，耗时：${cost}s`);
   }
   return replyList;
};
```

# 国际化

## 国际化语言的动态加载

# 多平台适配

## 适配策略

## 移动端 100vh 解决（插件）

# swiper

## swiper 嵌套情况下的垂直滚动（滚动到边缘会出界即边缘检测）

## swiper 延迟滚动、解决滚轮不够顺滑问题

# 懒加载

## 懒加载实现、封装类似 react-spring 的 lazyloader，动态监听 src/srcSet 实现同步

## 编译原理相关：利用 ts-morph、ts-morpher 自动导入 lazyloader 的 lazyElement 的 div、video、img 组件

# 弹窗 hook 封装

## useModal、useImgAndTextDisplayer 封装

## lazyloader 循环引用导致的报错、检测

# 懒加载

## lazyloader 加载不同分辨率的图片（useReponsive 封装）

# 其他

## loadScript 优化之路（uuid、函数缓存）

## 视频播放进度控制失效：domRef.current.currentTime = 0, https://stackoverflow.com/questions/4360060/video-streaming-with-html-5-via-node-js#18241169

## useScrollDirection 封装

## UC 后台设置 set-cookie 失效（待解决）

## 子级滚动、父级不滚动的兼容性处理

// TODO 国际官网技术难点待写作
