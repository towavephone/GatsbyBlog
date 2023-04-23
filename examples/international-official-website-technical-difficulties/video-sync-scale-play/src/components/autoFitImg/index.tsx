import React, { CSSProperties, useRef } from 'react'
import classNames from 'classnames'

import useResetStatus from '@/components/lazyLoader/hooks/useResetStatus' // 避免循环引用

import styles from './index.module.less'

export interface AutoFitImgProps {
  src: string // 图源为 1920 原型下的一倍图（默认在 750~1920 之间加载）
  srcSet?: string // 图源为 1920 原型下的二倍图（默认在 1920 以上加载）
  minSrcSet?: string // 图源为 h5 原型下的二倍图（默认在 750 以下加载）
  minWidth?: number | string // 默认 1920，即 1920 以上取 PC 的二倍图
  minSrcSetWidth?: string // 默认 750，即 750 以下取 h5 的 2 倍图，一般是 750
  maxWidth?: number | string
  width?: number | string // 图片宽度 不设置则为父容器宽度
  height?: number | string // 图片高度 不设置则为父容器高度
  lazy?: boolean // 是否懒加载
  className?: string
  style?: CSSProperties
}

type SourceProps = JSX.IntrinsicElements['source'] & {
  ['data-srcset']?: string
}

type ImgProps = JSX.IntrinsicElements['img'] & {
  ['data-src']?: string
}

const AutoFitImg = (props: AutoFitImgProps) => {
  const {
    src,
    srcSet,
    minWidth = '1920px',
    minSrcSet,
    minSrcSetWidth = '750px',
    maxWidth,
    width,
    height,
    lazy = true,
    className,
    style = null
  } = props

  // 二倍图，即 1920 以上
  const sourceProps: SourceProps = {
    media: minWidth ? `(min-width: ${minWidth})` : (maxWidth ? `(max-width: ${maxWidth})` : '')
  }

  // h5，即 0 ~ 750 之间
  const minSourceProps: SourceProps = {
    media: `(max-width: ${minSrcSetWidth})`
  }

  // 剩下的都是一倍图

  const imgProps: ImgProps = {
    className: styles.bgImg
  }

  const domRef = useRef(null)
  if (lazy) {
    sourceProps['data-srcset'] = srcSet
    minSourceProps['data-srcset'] = minSrcSet
    imgProps['data-src'] = src
    imgProps.className = `${imgProps.className} lazy`
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useResetStatus(domRef, [src, srcSet, minSrcSet])
  } else {
    sourceProps.srcSet = srcSet
    minSourceProps.srcSet = minSrcSet
    imgProps.src = src
  }

  return (
    <div
      className={classNames(styles.fullBannerContainer, className, 'auto-fit-img')}
      style={{ ...style, ...(width && height ? { width: width, height: height } : {}) }}
    >
      <picture>
        {
          srcSet && <source {...sourceProps} />
        }
        {
          minSrcSet && <source {...minSourceProps} />
        }
        <img ref={domRef} {...imgProps} />
      </picture>
    </div>
  )
}

export default AutoFitImg
