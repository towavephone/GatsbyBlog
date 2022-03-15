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

实现如下所示动效

```video
autoplay: true
loop: true
muted: true
controls: false
name: 逐行显示动效
src: "/examples/international-official-website-technical-difficulties/line-by-line-display.mp4"
span: 6
width: 100%
```

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

实现如下所示动效

```video
autoplay: true
loop: true
muted: true
controls: false
name: 数字滚动展示动效
src: "/examples/international-official-website-technical-difficulties/number-change-display.mp4"
span: 6
width: 100%
```

### 核心代码

选型过程同上，这里直接看代码

```tsx
import React, {
  ReactNode,
  useRef,
  useEffect
} from 'react'
import classnames from 'classnames'
import { a, useTrail, useSprings, useSpringRef } from '@react-spring/web'
import { useInViewport } from 'ahooks'

import { delayFunc } from '@/utils'

import PageStyles from './index.module.less'

interface TitleContent {
  title: string
}

interface NumberContent {
  number: string
  unit: string
  precision?: number
  render?: (value: number) => string
}

interface CommonDataItem {
  hint: string
}

type DataItem = CommonDataItem & (TitleContent | NumberContent)

interface Props {
  data: DataItem[]
  className?: string
  delay?: number
}

const CarConfiguration = ({
  data,
  className,
  delay = 300
}: Props) => {
  const [trails, trailsApi] = useTrail(data.length, () => ({
    opacity: 0,
    y: 40
  }))

  const springsRef = useSpringRef()
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
  )

  const domRef = useRef()
  const [inViewPort] = useInViewport(domRef)
  useEffect(() => {
    const startAnimation = async () => {
      await delayFunc(delay)
      trailsApi.start({
        y: 0,
        opacity: 1
      })
      await delayFunc(1200)
      springsRef.start()
    }

    const reverseAnimation = () => {
      trailsApi.start({
        y: 40,
        opacity: 0
      });
      [springsRef].forEach((item) => {
        item && item.start({
          reverse: true
        })
      })
    }

    if (inViewPort) {
      startAnimation()
    } else {
      reverseAnimation()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inViewPort])

  return (
    <div ref={domRef} className={classnames(PageStyles.configuration, className, 'car-configuration')}>
      {
        trails.map((style, index) => {
          const item = data[index]
          let title: ReactNode = (item as TitleContent).title
          const titleComponent = <><span className={PageStyles.configurationTitle} key={Math.random()} dangerouslySetInnerHTML={{ __html: (item as TitleContent).title }} />
            <span className={PageStyles.unit} key={Math.random()} dangerouslySetInnerHTML={{ __html: (item as any).unit }} /></>
          const numberItem = item as NumberContent
          if (!title && numberItem.number) {
            const renderFunc = numberItem.render ? numberItem.render : (value: number) => value.toFixed(numberItem.precision || 0)
            title = (
              <>
                <a.span>{springs[index].number.to(renderFunc)}</a.span>
                <span className={PageStyles.unit} key={Math.random()} dangerouslySetInnerHTML={{ __html: numberItem.unit }} />
              </>
            )
          }
          return (
            <>
              <a.div
                key={index}
                className={classnames(PageStyles.configurationItem, 'car-configuration-item')}
                style={style}
              >
                {
                  typeof title === 'string'
                    ? titleComponent
                    : <div className={PageStyles.configurationTitle}>{title} </div>}
                <div className={PageStyles.configurationHint}>{item.hint}</div>
              </a.div>
              {
                index < trails.length - 1 && <a.div
                  key={index}
                  className={PageStyles.divider}
                  style={style}
                />
              }
            </>
          )
        })
      }
    </div>
  )
}

export default CarConfiguration
```

### 运行效果

## 固定页面滚动展示

### 需求背景

实现如下所示的动效

## 视频同步、缩放

### 需求背景

实现如下所示的动效

### 核心代码

```tsx

```

## scroll 动画选型过程：

      1. scrollMagic
      2. react-scrollmagic
      3. react-gsap + scrollTrigger
      4. gsap + scrollTrigger

## 动画序列帧选型过程：

      -  视频方向

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

      -  图片方向

         1. 预加载所有图片 + 图片序列帧（参考张博客，体积较大）
         2. pixi-apngAndGif，使用 apng 控制播放进度（体积太大）
         3. 针对方案 1，使用 avif + avif.js，暂时未知解码性能如何，猜测同样都是 av1 解码，可能解码性能不行；
         4. 针对方案 1，使用 webp，解码性能同样可能不行
         5. 针对方案 1，使用 jpg

## 视频批量压缩脚本、支持单个压缩（有声音、转 mpeg 单独压缩）

## 计算 calc 的实际 px 值

## p7 resize 后动画定位不准的 bug

# 国际化

## 国际化语言的动态加载

# 多平台适配

## 移动端 100vh 解决（插件）

## 子级滚动、父级不滚动的兼容性处理

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

// TODO 国际官网技术难点待写作
