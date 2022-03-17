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

完成官网 1.0 的上线，实现动效、国际化、多平台适配等功能

# 动效

## 逐行显示

### 需求背景

实现功能如下：

x 旋转 -> 不同文字由下而上透明度从 0 到 1

实现要点如下：

1. 进入视口执行一次
2. 离开视口重置动画

实现如下所示动效：

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

[line-by-line-display-react-spring](embedded-codesandbox://international-official-website-technical-difficulties/line-by-line-display-react-spring)

#### react-gsap

[line-by-line-display-react-gsap](embedded-codesandbox://international-official-website-technical-difficulties/line-by-line-display-react-gsap)

## 数字滚动展示

### 需求背景

实现功能如下：

1. 数字有滚动效果
2. 整体有位移、透明度变化效果

实现要点如下：

1. 进入视口执行一次
2. 离开视口重置动画

实现如下所示动效：

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

实现功能如下：

1. 页面往下完全滚动到第二屏时，视频开始播放，鼠标的滚动一段距离后，触发视频缩小到右下角视频的动效
2. 文字、图片有缩放效果

实现要点如下：

1. 视频在视口范围内只会播放一次，完全离开视口重置播放进度，完全进入视口播放视频
2. 由 2 个视频拼接而成，触发缩放的瞬间进度需要同步（在视频未播放完成的情况下需要同步）
3. 过渡时需要使用 visibility 来控制显隐

实现如下所示的动效：

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

需要全部使用 rem 单位，否则 resize 后定位不准

### 运行效果

## 固定页面滚动控制

### 需求背景

实现要点：

1. 随着鼠标滚轮滚动而触发的动效（跟随鼠标滚动，鼠标停顿时，动效也会停顿）
2. 需要固定页面

实现如下所示的动效：

<video src="/examples/international-official-website-technical-difficulties/fix-page-scroll-display.mp4" loop muted autoplay width="100%"></video>

### 选型过程

| 选型 | 优点 | 缺点 |
| :-- | :-- | :-- |
| ScrollMagic | 官网例子满足需求 | 需要封装成 react |
| react-scrollmagic | <ol><li>可在 react 中直接使用</li><li>提供固定页面的百分比可完美用于 react-gsap 动效</li></ol> | <ol><li>滑动过快会出现“抖动”</li><li>不能实现切屏 + 固定页面同时存在的效果</li></ol> |
| react-gsap + scrollTrigger | 解决了“抖动”问题 | react-gsap 暴露的 api 不够底层，实现切屏 + 固定页面较困难 |
| gsap + scrollTrigger | 解决了以上的所有缺点 | 代码量过多，react 下需要考虑情况较多 |

### 核心代码

#### react-scrollmagic

web/components/reactScrollMagic/index.tsx

```tsx
import React, { Children, cloneElement, ReactElement } from 'react'
import { Controller as XPController, Scene, SceneProps as XPSceneProps } from 'xp-react-scrollmagic'

import useStoreContext, { CLIENT_TYPE } from '@/hooks/useStoreContext'

import { getWindowHeight } from '@/utils'

const defaultControllerProps = {
  // container: getDocument()?.querySelector('h')
}

const defaultSceneProps = {
  indicators: false,
  triggerHook: 0,
  duration: getWindowHeight()
}

interface ProgressEventsParams {
  progress: number
  event: {
    state: string
    type: string
  }
}

export interface SceneProps {
  sceneProps?: (Partial<XPSceneProps> & { enableParams: boolean }) | null
  sceneParams?: ProgressEventsParams
}

interface ControllerProps {
  children: Array<ReactElement<SceneProps>> | ReactElement<SceneProps>
}

const ReactScrollMagic = ({
  children
}: ControllerProps) => {
  const { state } = useStoreContext()

  const renderChildren = Children.map(children, (item, index) => {
    const sceneProps = {
      ...defaultSceneProps,
      pin: state?.clientType === CLIENT_TYPE.PC,
      ...item.props.sceneProps
    }
    if (sceneProps.enableParams) {
      const {
        enableParams,
        ...rest
      } = sceneProps
      return (
        <Scene
          {...rest}
        >
          {
            (progress: number, event: { state: string }) => {
              return <div>
                {
                  cloneElement(item, {
                    ...item.props,
                    sceneParams: {
                      progress,
                      event
                    }
                  })
                }
              </div>
            }
          }
        </Scene>
      )
    }
    return (
      <Scene
        {...sceneProps}
      >
        <div>
          {item}
        </div>
      </Scene>
    )
  })

  return (
    <XPController {...defaultControllerProps}>
      <div>
        {renderChildren}
      </div>
    </XPController>
  )
}

export default ReactScrollMagic
```

使用时：

web/pages/p7/render.tsx

```tsx
import ReactScrollMagic from '@/components/reactScrollMagic';
import { getWindowHeight } from '@/utils';

<ReactScrollMagic>
   <Sepa
      sceneProps={{
         enableParams: true,
         duration: getWindowHeight() * 2 // 总共停 2 屏高度
      }}
   />
</ReactScrollMagic>;
```

web/pages/p7/components/sepa/index.tsx

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
      start: 1 / 2, // 滚动到一半的时候才开始动效
      duration: 1 / 2 // 动效的持续百分比
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

#### react-gsap

后期需要实现 `切屏 + 固定页面` 的效果，暂未实现

```tsx
import React, { Children, cloneElement, useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import produce from 'immer';

import { getDocument } from '@/utils';

if (getDocument()) {
   import('gsap/ScrollTrigger').then((component) => {
      const ScrollTrigger = component.default;
      gsap.registerPlugin(ScrollTrigger);
   });
}
const ReactScrollMagic = ({ children }) => {
   const revealRefs = useRef([]);
   const [updateParams, setUpdateParams] = useState([]);
   revealRefs.current = [];

   useEffect(() => {
      revealRefs.current.forEach((el, index) => {
         gsap.from(el, {
            scrollTrigger: {
               trigger: el,
               pin: true,
               start: 'top top',
               end: '+=300%',
               markers: true,
               anticipatePin: 2, // 滑动过快时的“防抖”参数
               onUpdate: (self) => {
                  console.log(
                     self,
                     'progress:',
                     self.isActive,
                     self.progress.toFixed(3),
                     'direction:',
                     self.direction,
                     'velocity',
                     self.getVelocity()
                  );
                  const { progress, isActive } = self;
                  setUpdateParams(
                     produce((draftState) => {
                        draftState[index] = {
                           progress,
                           isActive
                        };
                     })
                  );
               }
            }
         });
      });
   }, []);

   const addToRefs = (el, index) => {
      if (el && !revealRefs.current.includes(el)) {
         revealRefs.current[index] = el;
      }
      console.log(revealRefs.current);
   };

   return Children.map(children, (item, index) => {
      // const sceneProps = {
      //   ...defaultSceneProps,
      //   ...item.props.sceneProps
      // }
      return (
         <div ref={(el) => addToRefs(el, index)}>
            {cloneElement(item, {
               ...item.props,
               sceneParams: updateParams[index] || {}
            })}
         </div>
      );
   });
};

export default ReactScrollMagic;
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

#### pixi-apngAndGif

```tsx
import React, { useEffect, useRef, useState } from 'react'
import { InputNumber } from 'antd'

import XButton from '@/components/xButton'

const Index = () => {
  const domRef = useRef(null)
  const [apngApi, setApngApi] = useState()
  const [value, setValue] = useState(0)

  useEffect(() => {
    import('@/lib/pixi-apng').then((pixiApng) => {
      const PixiApng = pixiApng.default
      const { PIXI } = pixiApng
      const app = new PIXI.Application({
        width: domRef.current?.width,
        height: domRef.current?.height,
        view: domRef.current,
        transparent: true,
        antialias: true
      })
      const loader = PIXI.Loader.shared
      const loadOption = {
        loadType: PIXI.LoaderResource.LOAD_TYPE.XHR,
        xhrType: PIXI.LoaderResource.XHR_RESPONSE_TYPE.BUFFER,
        crossOrigin: ''
      }
      const imgs = {
        apng: '/public/demo/demo.png'
      }
      loader.add(imgs.apng, loadOption)

      loader.load((progress, resources) => {
        const apngApi = new PixiApng(imgs.apng, resources)
        setApngApi(apngApi)
        const apngSprite = apngApi.sprite

        apngSprite.x = 0
        apngSprite.y = 0

        apngSprite.width = 1000
        apngSprite.height = 500

        app.stage.addChild(apngSprite)
      })
    })
  }, [])

  return (
    <div style={{ marginTop: 100, width: 1920, height: 1080 }}>
      <XButton onClick={() => {
        apngApi.play()
      }}>
        开始
      </XButton>
      <XButton onClick={() => {
        apngApi.pause()
      }}>
        停止
      </XButton>
      <XButton onClick={() => {
        apngApi.stop()
      }}>
        终止
      </XButton>
      <InputNumber value={value} onChange={setValue} precision={0} />
      <XButton onClick={() => {
        apngApi.jumpToFrame(value)
      }}>
        停到第几帧
      </XButton>
      <XButton onClick={() => {
        window.alert(apngApi.getDuration())
      }}>
        时长
      </XButton>
      <XButton onClick={() => {
        window.alert(apngApi.getFramesLength())
      }}>
        帧数
      </XButton>
      <canvas ref={domRef} width="1920" height="1080"></canvas>
    </div>
  )
}

export default Index
```

#### ogv.js

```tsx
import React, { useRef, useEffect, useState } from 'react';
import classNames from 'classnames';
import { useInViewport, useAsyncEffect } from 'ahooks';

import { loadScript } from '@/utils';

import styles from './index.module.less';

interface JsmpegPlayerProps {
   src: string;
   progress?: number; // 播放进度，0~1
   className?: string;
   autoplay?: boolean;
   loop?: boolean;
   seekable?: boolean;
   preserveDrawingBuffer?: boolean;
}

// https://github.com/phoboslab/jsmpeg/tree/v0.2
const JsmpegPlayer = ({ src, progress, className, ...rest }: JsmpegPlayerProps) => {
   const [isLoad, setIsLoad] = useState(true);
   const [isLoadJsmpeg, setIsLoadJsmpeg] = useState(true);
   const playerRef = useRef();
   const domRef = useRef(null);

   useAsyncEffect(async () => {
      await loadScript('/public/lib/ogvjs-1.8.6/ogv.js');
      setIsLoadJsmpeg(false);
   }, []);

   const [inViewPort] = useInViewport(domRef);
   useEffect(() => {
      if (!inViewPort || isLoadJsmpeg || !isLoad) {
         return;
      }
      // eslint-disable-next-line new-cap
      playerRef.current = new window.OGVPlayer({
         wasm: true, // force,
         simd: true // experimental
         // threading: true
      });
      domRef.current.appendChild(playerRef.current);
      playerRef.current.muted = true;
      playerRef.current.src = src;
      playerRef.current.addEventListener('loadedmetadata', () => {
         setIsLoad(false);
      });
   }, [inViewPort, isLoadJsmpeg]);

   useEffect(() => {
      if (isLoad || typeof progress !== 'number') {
         return;
      }
      const calcProgress = progress < 0 ? 0 : progress > 1 ? 1 : progress;
      console.log('calcProgress', calcProgress);
      playerRef.current.currentTime = calcProgress * playerRef.current.duration;
   }, [progress, isLoad]);

   return <div ref={domRef}></div>;
};

export default JsmpegPlayer;
```

#### video

web/components/lazyLoader/components/video/components/core/hooks/useProgressControl.ts

```ts
import { useEffect, useState } from 'react';

import { CommonProps } from '../index';

export interface UseProgressControlProps {
   progress?: number;
   playStrategy?: 'progressControl';
}

const useProgressControl = ({
   progress,
   playStrategy,
   onSetVideoProps,
   domRef
}: UseProgressControlProps & CommonProps) => {
   const [isLoad, setIsLoad] = useState(true);
   const [duration, setDuration] = useState(0);

   const handleLoadedMetadata = () => {
      const { duration } = domRef.current;
      setDuration(duration);
      setIsLoad(false);
   };

   useEffect(() => {
      if (isLoad || typeof progress !== 'number' || playStrategy !== 'progressControl') {
         return;
      }

      const calcProgress = progress < 0 ? 0 : progress > 1 ? 1 : progress;
      domRef.current.currentTime = calcProgress * duration;
   }, [progress, isLoad]);

   useEffect(() => {
      if (playStrategy === 'progressControl') {
         onSetVideoProps({
            muted: true,
            playsInline: true,
            preload: 'metadata'
         });
      }
   }, [playStrategy]);

   return {
      handleLoadedMetadata
   };
};

export default useProgressControl;
```

#### jsmpeg

现阶段采用的技术选型

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

compress.config.js

```js
module.exports = {
   mp4: {
      mp4: {
         bashFunc: (input, output) =>
            `ffmpeg -y -i ${input} -b:v 2048k -maxrate:v 2048k -minrate:v 2048k -r 25 -an -movflags faststart -v fatal ${output}`,
         hasAudio: {
            bashFunc: (input, output) =>
               `ffmpeg -y -i ${input} -b:v 2048k -maxrate:v 2048k -minrate:v 2048k -r 25 -movflags faststart -v fatal ${output}`,
            files: ['public/p7/xmart-os/p7-p6-1.mp4', 'public/no/p7/build-yours/p7-p1-1@long.mp4']
         }
      },
      mpeg: {
         4: {
            bashFunc: (input, output) =>
               `ffmpeg -y -i ${input} -f mpeg1video -codec:v mpeg1video -q 4 -bf 0 -r 25 -an -movflags faststart -v fatal ${output}`,
            files: [
               'public/p5/smart-space-internal/p5-inside.mp4',
               'public/p7/extra-performance/p7-chassis.mp4',
               'public/p7/learn-more/p7-wing.mp4',
               'public/g3i/xmart-os/g3i-inside.mp4'
            ]
         }
      }
   }
};
```

# 国际化

## 语言动态加载

### 目录结构

```
.
├── i18n.ts
└── lang
    ├── da-DK
    ├── en-US
    ├── nb-NO
    ├── nl-NL
    └── sv-SE
```

### 核心代码

```ts
import i18n, { Resource } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { DEFAULT_LANGUAGE } from '@/constants';
import path from 'path';
import { camelCase } from 'lodash';

const moduleFiles = require.context('./lang', true, /\.ts$/);

const resources: Resource = {};

moduleFiles.keys().forEach((item: string) => {
   const dirname = path.dirname(item);
   // 取路径里面的第一个目录
   const keys = dirname.split('/').filter((item) => item && item !== '.');
   const [key, ...restKey] = keys;
   if (key) {
      let value = moduleFiles(item).default || moduleFiles(item);
      const pathPrefix = [];
      // 是否携带路径前缀
      if (value.withPathPrefix) {
         pathPrefix.push(...restKey);
      }
      // 是否携带文件前缀
      if (value.withFilePrefix) {
         const basename = path.basename(item, '.ts');
         pathPrefix.push(basename);
      }

      if (pathPrefix.length > 0) {
         const newValue: { [key: string]: any } = {};
         const newPathPrefix = pathPrefix.map(camelCase).join('.');
         Object.keys(value).forEach((key2) => {
            newValue[`${newPathPrefix}.${key2}`] = value[key2];
         });
         value = newValue;
      }

      if (resources[key]) {
         resources[key].translation = {
            ...(resources[key].translation as {}),
            ...value
         };
      } else {
         resources[key] = {
            translation: value
         };
      }
   }
});

export const initLanguage = async function(language: string = DEFAULT_LANGUAGE) {
   if (i18n.isInitialized) {
      if (language !== i18n.language) {
         await i18n.changeLanguage(language);
      }
      return;
   }
   return await i18n
      .use(initReactI18next) // passes i18n down to react-i18next
      .init({
         resources,
         debug: process.env.NODE_ENV === 'development',
         lng: language,
         keySeparator: false, // we do not use keys in form messages.welcome
         interpolation: {
            escapeValue: false
         }
         // 不能使用数组或对象，因为需要用户去填字符串
         // returnObjects: true
      })
      .catch((error) => {
         console.info('initReactI18next error:', error);
      });
};
```

添加所需的字段：

web/locales/lang/en-US/p7/app-download.ts

```ts
export default {
   withPathPrefix: true,
   withFilePrefix: true,
   title: '123456'
};
```

使用时的代码：

```tsx
import { useTranslation } from 'react-i18next';
const { t } = useTranslation();
const getValue = (param: string) => t(`p7.appDownload.${param}`);
// console.log(getValue('title'))
```

## 路由复用

### 需求背景

国家站的页面和国际站大部分的页面相同，只是语言不同，可以复用路由

### 核心代码

```ts
const { join } = require('path')
const { getFeDir } = require('ssr-server-utils')
const fs = require('fs')

const countryList = ['no', 'se', 'dk', 'nl'] // 挪威 NO, 瑞典 SE, 丹麦 DK, 荷兰 NL

// https://github.com/zhangyuang/ssr/blob/8e9e5514d81f0db24a8c9e59bac8379f7a09a2c0/packages/server-utils/src/parse.ts#L159
const renderRoutes = (pageDir, pathRecord, route) => {
  let arr = []
  const pagesFolders = fs.readdirSync(pageDir)
  const prefixPath = pathRecord.join('/')
  const aliasPath = `@/pages${prefixPath}`
  const routeArr = []
  const fetchExactMatch = pagesFolders.filter(p => p.includes('fetch'))
  for (const pageFiles of pagesFolders) {
    const abFolder = join(pageDir, pageFiles)
    const isDirectory = fs.lstatSync(abFolder).isDirectory()
    if (isDirectory) {
      // 如果是文件夹则递归下去, 记录路径
      pathRecord.push(pageFiles)
      const childArr = renderRoutes(abFolder, pathRecord, Object.assign({}, route))
      pathRecord.pop() // 回溯
      arr = arr.concat(childArr)
    } else {
      // 遍历一个文件夹下面的所有文件
      if (!pageFiles.includes('render')) {
        continue
      }
      // 拿到具体的文件
      if (pageFiles.includes('render$')) {
        /* /news/:id */
        route.path = `${prefixPath}/:${getDynamicParam(pageFiles)}`
        route.component = `${aliasPath}/${pageFiles}`
        let webpackChunkName = pathRecord.join('-')
        if (webpackChunkName.startsWith('-')) {
          webpackChunkName = webpackChunkName.replace('-', '')
        }
        route.webpackChunkName = `${webpackChunkName}-${getDynamicParam(pageFiles).replace(/\/:\??/g, '-').replace('?', '-optional')}`
      } else if (pageFiles.includes('render')) {
        /* /news */
        route.path = `${prefixPath}`
        route.component = `${aliasPath}/${pageFiles}`
        let webpackChunkName = pathRecord.join('-')
        if (webpackChunkName.startsWith('-')) {
          webpackChunkName = webpackChunkName.replace('-', '')
        }
        route.webpackChunkName = webpackChunkName
      }

      if (fetchExactMatch.length >= 2) {
        // fetch 文件数量 >=2 启用完全匹配策略 render$id => fetch$id, render => fetch
        const fetchPageFiles = `${pageFiles.replace('render', 'fetch').split('.')[0]}.ts`
        if (fetchExactMatch.includes(fetchPageFiles)) {
          route.fetch = `${aliasPath}/${fetchPageFiles}`
        }
      } else if (fetchExactMatch.includes('fetch.ts')) {
        // 单 fetch 文件的情况 所有类型的 render 都对应该 fetch
        route.fetch = `${aliasPath}/fetch.ts`
      }
      routeArr.push({ ...route })
    }
  }
  routeArr.forEach((r) => {
    if (r.path?.includes('index')) {
      r.path && arr.push(JSON.parse(JSON.stringify(r)))
      // /index 映射为 /
      if (r.path.split('/').length >= 3) {
        r.path = r.path.replace('/index', '')
      } else {
        r.path = r.path.replace('index', '')
      }
    }

    r.path && arr.push(r)
  })

  return arr
}

const getDynamicParam = (url) => {
  return url.split('$').filter(r => r !== 'render' && r !== '').map(r => r.replace(/\.[\s\S]+/, '').replace('#', '?')).join('/:')
}

const accessFile = (file) => {
  try {
    fs.accessSync(file)
  } catch (error) {
    return false
  }
  return true
}

const { dynamic = true, routerPriority, routerOptimize } = {}
const prefix = ''
// 根据目录结构生成前端路由表
const pathRecord = [''] // 路径记录
const route = {}
let arr = renderRoutes(join(getFeDir(), 'pages'), pathRecord, route)
if (routerPriority) {
  // 路由优先级排序
  arr.sort((a, b) => {
    // 没有显示指定的路由优先级统一为 0
    return (routerPriority[b.path] || 0) - (routerPriority[a.path] || 0)
  })
}

if (routerOptimize) {
  // 路由过滤
  if (routerOptimize.include && routerOptimize.exclude) {
    throw new Error('include and exclude cannot exist synchronal')
  }
  if (routerOptimize.include) {
    arr = arr.filter(route => routerOptimize.include.includes(route.path))
  }
  if (routerOptimize.exclude) {
    arr = arr.filter(route => !routerOptimize.exclude.includes(route.path))
  }
}

const countryRoutes = []
countryList.forEach(country => {
  arr.forEach(route => {
    const path = `/${country}${route.path}`
    // 注意这里需要去除掉 2 个国家的无效路径
    if (arr.every(route => route.path !== path) && path.split('/').filter((item) => countryList.includes(item)).length <= 1) {
      countryRoutes.push({
        ...route,
        path
      })
    }
    if (route.path === '/') {
      countryRoutes.push({
        ...route,
        path: `/${country}`
      })
    }
  })
})

arr = arr.concat(countryRoutes)

const accessReactApp = accessFile(join(getFeDir(), './components/layout/App.tsx'))
const layoutFetch = accessFile(join(getFeDir(), './components/layout/fetch.ts'))
const accessStore = accessFile(join(getFeDir(), './store/index.ts'))
const re = /"webpackChunkName":("(.+?)")/g

let routes = `
        // The file is provisional，don't depend on it
        export const FeRoutes = ${JSON.stringify(arr)}
        ${accessReactApp ? 'export { default as App } from "@/components/layout/App.tsx"' : ''}
        ${layoutFetch ? 'export { default as layoutFetch } from "@/components/layout/fetch.ts"' : ''}
        ${accessStore ? 'export * from "@/store/index.ts"' : ''}
        ${prefix ? `export const PrefixRouterBase='${prefix}'` : ''}
      `
routes = routes.replace(/"component":("(.+?)")/g, (global, m1, m2) => {
  const currentWebpackChunkName = re.exec(routes)[2]
  if (dynamic) {
    return `"component": function dynamicComponent () {
            return import(/* webpackChunkName: "${currentWebpackChunkName}" */ '${m2.replace(/\^/g, '"')}')
          }
          `
  } else {
    return `"component": require('${m2.replace(/\^/g, '"')}').default`
  }
})
re.lastIndex = 0
routes = routes.replace(/"fetch":("(.+?)")/g, (global, m1, m2) => {
  const currentWebpackChunkName = re.exec(routes)[2]
  return `"fetch": () => import(/* webpackChunkName: "${currentWebpackChunkName}-fetch" */ '${m2.replace(/\^/g, '"')}')`
})

fs.writeFileSync(join(getFeDir(), 'route.ts'), routes)
// 替换以下 console.log 内容即可在 router.json 文件找到所有的官网路径
// console.log(arr.map((item) => item.path).join('\n'))
fs.writeFileSync(join(__dirname, '../src/router.json'), JSON.stringify(arr))
```

# 多平台适配

## 需求背景

需要适配 PC、H5 的样式

## 选型过程

1. PC 使用 rem 单位，h5 使用 vw 单位（ipad 端适配有问题，需要全部使用 rem 单位，便于样式控制），使用 @our-patches/postcss-px-to-viewport 插件做转换
2. h5 端 100vh 的高度展示有问题，需要实时计算高度，使用 postcss-viewport-height-correction 插件实现

## 核心代码

postcss.config.js

```js
module.exports = {
   plugins: [
      [
         '@our-patches/postcss-px-to-viewport',
         {
            // https://github.com/evrone/postcss-px-to-viewport/blob/master/README_CN.md
            unitToConvert: 'px', // 需要转换的单位，默认为"px"
            viewportWidth: 1920, // 视窗的宽度，对应设计稿的宽度
            unitPrecision: 8, // 指定 px 转换为视窗单位值的小数后 x 位数，转换精度尽可能的大，防止出现图片比例问题
            viewportUnit: 'rem', // 希望使用的视口单位
            fontViewportUnit: 'rem', // 字体使用的视口单位,
            minPixelValue: 1, // 最小的转换数值
            mediaQuery: true, // 媒体查询里的单位是否需要转换单位
            selectorBlackList: [/^html$/, 'hack'],
            exclude: /node_modules/,
            include: [/(\\|\/)web(\\|\/)/]
         }
      ],
      // 此插件主要修复了移动端 100vh 的高度（即减去搜索框的高度），需要配合 script 脚本实现，详见 postcss-viewport-height-correction 文档
      // 效果：https://codepen.io/team/css-tricks/full/vapjge
      // https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
      'postcss-viewport-height-correction'
   ]
};
```

# swiper

## 需求背景

1. swiper 嵌套时的垂直滚动不会离开当前嵌套的容器，需要做到滚动到边缘会离开当前嵌套容器即边缘检测
2. 需要实现 swiper 延迟滚动、解决滚轮不够顺滑问题

## 核心代码

### 嵌套边缘检测

```tsx
const handleContainerWheel = (element) => {
   const scrollHeight = element.scrollHeight
   const slideSize = element.swiperSlideSize
   const scrollDifferenceTop = scrollHeight - slideSize

   const handleWheel = (event) => {
      const scrollDifference = scrollHeight - slideSize - element.scrollTop

      // Scroll wheel browser compatibility
      const delta = event.wheelDelta || -1 * event.deltaY

      // Enable scrolling if at edges
      const spos = delta < 0 ? 0 : scrollDifferenceTop
      const parseScrollDifference = Number.parseInt(`${scrollDifference}`)
      const parseSpos = Number.parseInt(`${spos}`)

      console.log(scrollDifference, spos)
      if (parseScrollDifference !== parseSpos) {
         console.log('stopPropagation')
         event.stopPropagation()
      } else {
         // 边缘释放参数关闭时才生效
         if (!swiperRef?.current?.params?.mousewheel?.releaseOnEdges) {
            // 滑动到最后一个幻灯片的底部，继续监听事件
            if (parseScrollDifference === 0 && parseSpos === 0 && current === swiperRef?.current?.slides?.length - 1) {
               return
            }
            // TODO 滑动到第一个幻灯片的顶部，暂不处理，暂时没有首屏有滚动条的情况
         }
         element.removeEventListener('wheel', handleWheel)
         element.removeEventListener('scroll', handleScroll)
      }
   }

   element.addEventListener('wheel', handleWheel)
}

const handleScrollContainerEvent = (activeSlide: ActiveSlide) => {
   const hasVerticalScrollbar = activeSlide.scrollHeight > activeSlide.clientHeight;
   if (!hasVerticalScrollbar) {
      return;
   }
   // 进入时重置滚动条
   activeSlide.scrollTo(0, 0);
   activeSlide.addEventListener('scroll', handleScroll);
   handleContainerWheel(activeSlide);
}

// 监听 swiper 的 onSlideChange 事件
return (
   <Swiper
      onSlideChange={(slide) => {
         swiperRef.current = slide;
         if (haveNestedScrollbar) {
            handleScrollContainerEvent(slide.slides[slide.realIndex] as ActiveSlide);
         }
      }}
   ></Swiper>
)
```

### 延迟滚动

具体代码见 [这里](https://github.com/towavephone/swiper/commit/c7daf2d123e4fdda385b69c1eaa636d876562ee3)

## 运行效果

# 懒加载

## 需求背景

需要对图片、视频进行懒加载

## 选型过程

| 选型 | 优点 | 缺点 |
| :-- | :-- | :-- |
| [lazyload](https://github.com/tuupola/lazyload) | 支持 img 延迟加载 | 不支持 video 延迟加载 |
| [lazysizes](https://github.com/aFarkas/lazysizes) | 支持 img、iframe 延迟加载 | 不支持 video 延迟加载 |
| [vanilla-lazyload](https://github.com/verlok/vanilla-lazyload) | [优点](https://github.com/verlok/vanilla-lazyload#vanilla-lazyload-vs-lazysizes) | 需要手动通知 dom 变化 |

## 实现难点

1. lazyloader 循环引用导致的报错、检测
2. lazyloader 加载不同分辨率的图片（ahooks 的 useReponsive 封装有问题，需要自己重新封装）
3. 封装使用形式类似 react-spring 的 lazyloader
4. 动态监听 src/srcSet 实现同步
5. 需要封装各种使用形式的组件，为此需要合理组织文件结构，需要实现的功能大致如下

<table>
   <tr>
      <th>UI 类型</th>
      <th>平台</th>
      <th>策略</th>
      <th>详细说明</th>
      <th>传递属性</th>
      <th>代码示例</th>
   </tr>
   <tr>
      <td rowspan="9">视频</td>
      <td rowspan="8">pc</td>
      <td>自动播放</td>
      <td>默认自动循环静音播放</td>
      <td>playStrategy = 'autoPlay'，默认不用传</td>
      <td></td>
   </tr>
   <tr>
      <td>点击播放</td>
      <td>点击循环静音播放、带自定义播放图标</td>
      <td>playStrategy = 'clickPlay'</td>
      <td></td>
   </tr>
   <tr>
      <td>按住播放</td>
      <td>按住循环播放、带自定义播放图标、带播放进度条显示</td>
      <td>playStrategy = 'pressHoldPlay'</td>
      <td></td>
   </tr>
   <tr>
      <td>点击视频弹窗播放</td>
      <td>短视频自动循环静音播放，点击短视频后弹窗自动播放长视频一次</td>
      <td>
         <ol>
            <li>传递 playStrategy = 'clickVideoModalPlay'</li>
            <li>原有的 srcSet、minSrcSet、src 控制短视频，这 3 个属性加上 long 前缀控制长视频，即 longSrcSet、longMinSrcSet、longSrc，如果不传 long 前缀属性则取短视频属性</li>
            <li>通过 ref 控制弹窗打开，调用 videoRef.current?.openModal()</li>
         </ol>
      </td>
      <td>
         import { l, ClickVideoModalPlayRef } from &#x27;@/components/lazyLoader&#x27;
         <br/>
         <br/>
         const videoRef = useRef&lt;ClickVideoModalPlayRef&gt;(null)
         <br/>
         <br/>
         // 调用示例
         useEffect(() =&gt; {
            setTimeout(() =&gt; {
               videoRef.current?.openModal()
            }, 6000)
         }, [])
         <br/>
         <br/>
         &lt;l.video
            ref={videoRef}
            playStrategy=&quot;clickVideoModalPlay&quot;
            src=&quot;/public/p7/xmart-os/p7-p6-1@short.mp4&quot;
            longSrc=&quot;/public/p7/xmart-os/p7-p6-1@long.mp4&quot; // 不传则取 src
         /&gt;
      </td>
   </tr>
   <tr>
      <td>悬停播放</td>
      <td>鼠标悬浮循环静音播放视频，离开时回到初始状态</td>
      <td>playStrategy = 'mouseOverPlay'</td>
      <td></td>
   </tr>
   <tr>
      <td>进度控制</td>
      <td>控制视频进度</td>
      <td>playStrategy = 'progressControl'，传递 progress（百分比，以 1 为单位）控制视频进度</td>
      <td></td>
   </tr>
   <tr>
      <td>点击播放（带控制条，播放状态控制）</td>
      <td>点击后播放一次视频、自带控制条、初始播放状态控制</td>
      <td>playStrategy = 'clickPlayWithControl'，传递 playing 控制初始播放状态</td>
      <td></td>
   </tr>
   <tr>
      <td>进入视口播放一次</td>
      <td>完全 100% 看到视频从头开始播放一次（每次看到视频就会触发）</td>
      <td>playStrategy = 'inViewportPlay'</td>
      <td></td>
   </tr>
   <tr>
      <td>h5</td>
      <td>点击图片弹窗播放</td>
      <td>
         <ol>
            <li>
               图片展示，带自定义播放图标，如无图片则取原视频第一帧
            </li>
            <li>
               点击自定义播放图标弹窗自动播放一次视频
            </li>
         </ol>
      </td>
      <td>
         <ol>
            <li>
               传 srcSetPoster, srcPoster, minSrcSetPoster 作为封面图片，可以只传 srcPoster
            </li>
            <li>
               默认 h5 使用此策略，不需要传 playStrategy（playStrategy === 'clickImgModalPlay'）
            </li>
            <li>
               如需覆盖请直接传具体的 playStrategy
            </li>
            <li>
               需要保证播放图标可以点击，全屏视频有可能点击不到，需要把视频样式的 z-index 去掉
            </li>
            <li>
               传递 playIconPosition 代表播放按钮位置
            </li>
            <li>
               showPlayIcon 代表是否展示播放图标
            </li>
            <li>
               通过 ref 控制弹窗打开，调用 videoRef.current?.openModal()
            </li>
         </ol>
      </td>
      <td></td>
   </tr>
   <tr>
      <td rowspan="2">图片</td>
      <td>pc</td>
      <td>正常展示</td>
      <td></td>
      <td></td>
      <td></td>
   </tr>
   <tr>
      <td>h5</td>
      <td>弹窗展示</td>
      <td>点击弹窗后展示，等比例放大，宽度自适应（弹窗图片的左右切换实现难度大，之后再做）</td>
      <td></td>
      <td></td>
   </tr>
</table>

## 运行效果

## 优化方向

1. 编译原理相关：利用 ts-morph、ts-morpher 自动导入 lazyloader 的 lazyElement 的 div、video、img 组件
2. img 组件没有封装，复用之前的组件

# 弹窗 hook 封装

## 需求背景

由于需要实现大量弹窗展示的功能，为了尽量减少代码行数，提高复用性，这里采用 hooks 的方式去实现弹窗

## useModal 封装

```tsx
import React, {
   useRef,
   forwardRef,
   useState,
   useImperativeHandle,
   useCallback,
   ComponentType,
   PropsWithoutRef
} from 'react';
import { ModalProps, Modal } from 'antd';

type ModalRefType<T> =
   | {
        open: (initProp?: Partial<T>) => void;
        close: () => void;
     }
   | undefined;

interface UseModalProps<T> {
   component: ComponentType<T>; // 子组件
   modalProps?: Partial<ModalProps>; // 弹窗属性
}

const useModal = function<T>({ component: Component, modalProps }: UseModalProps<T>) {
   const modalRef = useRef<ModalRefType<T>>();
   const [globalVisible, setGlobalVisible] = useState(false);

   const ComponentModal = forwardRef<ModalRefType<T>, T>((componetProps, componentRef) => {
      const [visible, setVisible] = useState(false);
      const [componentInitProp, setComponentInitProp] = useState<Partial<T>>();

      const handleOk = (initProps?: Partial<T>) => {
         if (initProps) {
            setComponentInitProp(initProps);
         }
         setVisible(true);
         setGlobalVisible(true);
      };

      const handleCancel = () => {
         setVisible(false);
         setGlobalVisible(false);
      };

      useImperativeHandle(componentRef, () => ({
         open: handleOk,
         close: handleCancel
      }));

      return (
         <Modal onCancel={handleCancel} visible={visible} {...modalProps}>
            <Component onCancel={handleCancel} {...componetProps} {...componentInitProp} />
         </Modal>
      );
   });

   return {
      Slot: useCallback((props: PropsWithoutRef<T>) => {
         return <ComponentModal ref={modalRef} {...props} />;
         // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []),
      // 这里不能传 modalRef.current，因为传递的是引用
      // 如果传的是 modalRef.current，会导致 modelRef.current 更新时不会同步更新到外部
      api: modalRef,
      visible: globalVisible
   };
};

export default useModal;
```

## useDisplayerModal 封装

弹窗有一些公用属性，需要再次分层便于复用

```tsx
import { ComponentType } from 'react';

import useModal from '@/hooks/useModal';

import styles from './index.module.less';

const useDisplayerModal = function<T>(Component: ComponentType<T>) {
   const result = useModal({
      component: Component,
      modalProps: {
         className: styles.modal,
         wrapClassName: styles.wrapClassName,
         closable: false,
         footer: null,
         // 这里 destroyOnClose 设置 true 的原因是：swiper 需要销毁，否则导致 swiper 卡住的 bug
         destroyOnClose: true,
         centered: false
      }
   });
   return result;
};

export default useDisplayerModal;
```

## 实现效果

# 其他

## loadScript 优化

### 需求背景

需要有一个方法来手动加载脚本，延迟脚本加载的时机

### 优化过程

1. 生成唯一性的 uuid 来判断这个脚本是否加载，以实现只加载一次脚本的功能
2. 由于 loadScript 方法会在同一个页面同一 src 多次调用，实际上判断脚本是否加载并不能完美实现（会导致同一脚本多次加载），考虑使用函数缓存实现

### 核心代码

```ts
import { memoize } from 'lodash';

type loadScriptOptions = Partial<Omit<HTMLScriptElement, 'src' | 'async'>> & {
  attributesMap?: {
    [key: string]: any
  }
  [key: string]: any
}

// 异步加载单个脚本
async function loadSingleScript(src: string, options: loadScriptOptions = {}) {
   return await new Promise((resolve, reject) => {
      // 这里未考虑到同一 src 同时发起的情况，改用缓存实现
      // if (!id) {
      //   const NAMESPACE = 'c2b16a16-12b3-423a-879f-6b46d1a01d60'
      //   const PREFIX = 'script-id-'
      //   id = PREFIX + uuidv5(src, NAMESPACE)
      // }
      // if (!src || document.querySelector(`#${id}`)) {
      //   return
      // }
      const script: any = document.createElement('script');
      const { attributesMap = {}, ...rest } = options;
      Object.keys(rest).forEach((key) => {
         script[key] = rest[key];
      });
      Object.keys(attributesMap).forEach((key) => {
         script.setAttribute(key, attributesMap[key]);
      });
      script.async = true;
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.getElementsByTagName('head')[0].appendChild(script);
   });
}

// 异步加载多个脚本
// memoize 默认情况下用第一个参数作为缓存的 key，即 src
export const loadScript = memoize(loadSingleScript);
```

## 视频播放进度控制失效

对于长视频，`domRef.current.currentTime = 0` 方法失效，需要对服务器配置，具体见[这里](https://stackoverflow.com/questions/4360060/video-streaming-with-html-5-via-node-js#18241169)

## useScrollDirection 封装

### 需求背景

需要知道页面的向上、向下滚动来实现特定需求

### 实现要点

使用 ahooks 的 useScroll、usePrevious、useThrottle，来分别实现得到当前滚动信息、得到前一个滚动信息、性能优化的节流处理的功能

### 核心代码

web/hooks/useScrollDirection.ts

```tsx
import { useScroll, usePrevious, useThrottle } from 'ahooks'
import type { Target, ScrollListenController } from 'ahooks/lib/useScroll'
import type { ThrottleOptions } from 'ahooks/lib/useThrottle/throttleOptions'

interface UseScrollDirectionResult {
  leftDelta: number
  topDelta: number
  scrollXDirection?: 'left' | 'right'
  scrollYDirection?: 'up' | 'down'
  left: number
  top: number
}

const useScrollDirection = (target: Target, shouldUpdate?: ScrollListenController, options: ThrottleOptions & { enable: boolean } = {
  enable: false,
  wait: 300,
  leading: true,
  trailing: true
}): UseScrollDirectionResult => {
  const position = useScroll(target, shouldUpdate)
  const prevPosition = usePrevious(position)

  const throttledPosition = useThrottle(position, options)
  const throttledPrevPosition = useThrottle(prevPosition, options)

  const newPosition = options.enable ? throttledPosition : position
  const newPrevPosition = options.enable ? throttledPrevPosition : prevPosition

  if (!newPosition || !newPrevPosition) {
    return {
      leftDelta: 0,
      topDelta: 0,
      left: 0,
      top: 0
    }
  }

  const leftDelta = newPosition.left - newPrevPosition.left
  const topDelta = newPosition.top - newPrevPosition.top

  const scrollXDirection = leftDelta > 0 ? 'right' : 'left'
  const scrollYDirection = topDelta > 0 ? 'down' : 'up'

  // console.log('throttledPosition', newPosition, newPrevPosition)

  return {
    leftDelta,
    topDelta,
    scrollXDirection,
    scrollYDirection,
    left: newPosition.left,
    top: newPosition.top
  }
}

export default useScrollDirection
```

## set-cookie 失效

UC 浏览器下服务器端设置 set-cookie 失效即 csrf token 设置失败，进而接口请求失败，原因未知

// TODO set-cookie 失效待解决

## 子级滚动、父级不滚动

### 需求背景

打开弹窗时此时有半透明遮罩，弹窗内是有滚动条的，此时弹窗的滚动条的滚动会牵连外面滚动条的滚动

### 解决过程

1. css：`overscroll-behavior: contain`，但是在移动端 safari 不支持
2. js：在不支持 css 的方法时，降级处理

### 核心代码

```ts
export function enableBodyScroll() {
   if (document.readyState === 'complete') {
      document.body.style.position = '';
      document.body.style.overflowY = '';

      if (document.body.style.marginTop) {
         const scrollTop = -parseInt(document.body.style.marginTop, 10);
         document.body.style.marginTop = '';
         window.scrollTo({
            left: window.pageXOffset,
            top: scrollTop,
            behavior: 'instant' // 关闭动画
         });
      }
   } else {
      window.addEventListener('load', enableBodyScroll);
   }
}

export function disableBodyScroll({ savePosition = false } = {}) {
   if (document.readyState === 'complete') {
      if (document.body.scrollHeight > window.innerHeight) {
         if (savePosition) document.body.style.marginTop = `-${window.pageYOffset}px`;
         document.body.style.position = 'fixed';
         document.body.style.overflowY = 'scroll';
      }
   } else {
      window.addEventListener('load', () => disableBodyScroll({ savePosition }));
   }
}
```

## 进度转换函数

### 需求背景

1. 页面固定动效多次用到百分比转换，需要封装函数便于使用、理解
2. 后期可能会实现缓动函数，需要提前封装便于修改

### 核心代码

```ts
interface GetAnimateProgressProps {
   progress: number;
   start: number;
   duration: number;
}

// 获取单个进度
export const getAnimateProgress = ({ progress, start, duration }: GetAnimateProgressProps) =>
   (progress - start) / duration;

type GetAnimateProgressesOptions = Omit<GetAnimateProgressProps, 'progress'>;

// 获取多个进度
export const getAnimateProgresses = (progress: number, options: GetAnimateProgressesOptions[]) =>
   options.map(({ start, duration }) =>
      getAnimateProgress({
         progress,
         start,
         duration
      })
   );
```

## cdn 全局链接替换

### 需求背景

public 下的所有文件都需要放到 cdn，减少服务器的压力同时访问速度更快，即要对所有前缀为 /public 的资源路径做替换

### 选型过程

1. 动态变量：在 midway 后端设置可读变量然后注入到前端 window 变量中，但是不能解决 midway、css 的前缀问题
2. 静态替换：在 build 阶段对所有的 /public 替换，但是目前运维不支持，运维只在 dev 环境中才能 build，需要运维解决

### 核心代码

scripts/build.js

```ts
const shelljs = require('shelljs');
const fsExtra = require('fs-extra');
const path = require('path');
const fs = require('fs');
const packageJson = require('../package.json');
const glob = require('glob');
const { merge } = require('lodash');

let config = require('../dist/config/config.default');
const ENV = process.env.EGG_SERVER_ENV || 'prod';
const fakeConfigParams = {
   name: '',
   appDir: ''
};
const configPath = `../dist/config/config.${ENV}.js`;
// console.log('ENV', ENV)
if (fs.existsSync(path.resolve(__dirname, configPath))) {
   config = merge(config.default(fakeConfigParams), require(configPath).default(fakeConfigParams));
}

console.log('Start handle source...');

fsExtra.mkdirpSync(path.resolve(__dirname, '../deploy'), { overwrite: true });
fsExtra.copySync(path.resolve(__dirname, '../public'), path.resolve(__dirname, '../deploy/public'), {
   overwrite: true
});

delete packageJson.devDependencies;
delete packageJson.scripts.preinstall;

fs.writeFileSync(path.resolve(__dirname, '../deploy/package.json'), JSON.stringify(packageJson));

// 暂时不需要处理异步加载的资源
// const assetManifest = require('../build/client/asset-manifest.json')
// const runtimePagePath = path.resolve(
//   __dirname,
//   '../build' + assetManifest['runtime~Page.js'].replace('/public', '')
// )

// const runtimePage = fs.readFileSync(runtimePagePath).toString()

// // 替换 webpack 打包的资源路径前缀
// fs.writeFileSync(
//   runtimePagePath,
//   runtimePage.replace(/"\/public\//g, 'window.__publicPath+"/public/')
// )

const assetManifest = require('../build/client/asset-manifest.json');
const runtimePagePath = assetManifest['runtime~Page.js'].replace('/public', 'build');
// console.log('runtimePagePath', runtimePagePath)

const replacePrefixFiles = [
   ...glob.sync('build/{client,server}/**/*.{js,css}'),
   ...glob.sync('dist/config/{menu,site}/**/*.js')
].filter((item) => item !== runtimePagePath);
const newPublicPath = config.publicPath || '';
const publicPath = newPublicPath.endsWith('/') ? newPublicPath + 'public/' : newPublicPath + '/public/';
// console.log('publicPath', publicPath)
replacePrefixFiles.forEach(function(file) {
   const fileContent = fs.readFileSync(file).toString();
   if (config.publicPath) {
      fs.writeFileSync(file, fileContent.replace(/\/public\//g, publicPath));
   }
});

fsExtra.moveSync(path.resolve(__dirname, '../build'), path.resolve(__dirname, '../deploy/build'), { overwrite: true });

if (fs.existsSync(path.resolve(__dirname, '../dist'))) {
   fsExtra.moveSync(path.resolve(__dirname, '../dist'), path.resolve(__dirname, '../deploy/dist'), { overwrite: true });
}

fsExtra.moveSync(path.resolve(__dirname, '../deploy'), path.resolve(__dirname, '../dist'), { overwrite: true });

glob.sync(path.resolve(__dirname, '../dist/**/*.map')).forEach(function(file) {
   fs.unlinkSync(file);
});

fsExtra.mkdirpSync(path.resolve(__dirname, '../dist/node_modules'), {
   overwrite: true
});

shelljs.exec('cp -r node_modules/xp-react-scrollmagic dist/node_modules/xp-react-scrollmagic');
```

## 热更新失败

### 需求背景

使用了 dangerouslySetInnerHTML 渲染的富文本组件，在编译之后不生效

### 核心代码

web/components/htmlComponent/index.tsx

```tsx
import React, { ReactNode } from 'react';

interface HtmlComponentProps {
   children: ReactNode;
   className?: string;
}

const HtmlComponent = ({ children, className }: HtmlComponentProps) =>
   typeof children === 'string' ? (
      // key={Math.random()} 必须设置，否则 props 不会更新，导致热更新失败
      <div className={className} key={Math.random()} dangerouslySetInnerHTML={{ __html: children }} />
   ) : (
      <div className={className}>{children}</div>
   );

export default HtmlComponent;
```
