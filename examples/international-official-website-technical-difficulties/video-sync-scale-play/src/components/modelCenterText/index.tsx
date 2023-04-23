import React, { ReactNode } from 'react'
import classNames from 'classnames'
import { Button } from 'antd'
import { NativeButtonProps } from 'antd/es/button/button'

import AnimationTitle, { AnimationTitleProps } from '@/components/animationTitle'

import styles from './index.module.less'

export interface ModelCenterTextProps extends AnimationTitleProps {
  closeIcon?: ReactNode
  topSubTitle?: ReactNode
  title: ReactNode
  subTitle: ReactNode
  shortDesc?: ReactNode
  buttonText?: ReactNode
  buttonProps?: NativeButtonProps
  className?: string
}

const ModelCenterText = (props: ModelCenterTextProps) => {
  const {
    topSubTitle,
    title,
    subTitle,
    shortDesc,
    buttonText,
    buttonProps,
    className,
    ...rest
  } = props

  return (
    <AnimationTitle
      {...rest}
      className={classNames(styles.container, className, 'model-center-text')}
      subTitle={[
        topSubTitle && <div className={classNames(styles.topSubTitle, 'top-sub-title')}>
          {topSubTitle}
        </div>,
        <div className={classNames(styles.title, 'title')}>
          {title}
        </div>,
        <div className={classNames(styles.subTitle, 'sub-title')}>
          {subTitle}
        </div>,
        shortDesc && <div className={classNames(styles.shortDesc, 'short-desc')}>
          {shortDesc}
        </div>,
        buttonText && <Button
          className={classNames(styles.button, 'button')}
          type="primary"
          {...buttonProps}
        >
          {buttonText}
        </Button>
      ]}
    />
  )
}

export default ModelCenterText
