import React from 'react'

import XIcon from '@/components/xIcon'
import { l, VideoProps, DivProps, ImgProps } from '@/components/lazyLoader'

import useDisplayerModal from '../useDisplayerModal'

import styles from './index.module.less'

type DisplayerProps = (
  VideoProps & { type?: 'video' }
) | (
    DivProps & { type?: 'div' }
  ) | (
    ImgProps & { type?: 'img' }
  )

type ModalBodyProps = DisplayerProps & {
  onCancel?: () => void
}
const ModalBody = (props: ModalBodyProps) => {
  if (!props.type) {
    return null
  }

  const DisplayerComponent = l[props.type]
  return (
    <div
      className={styles.container}
    >
      <div className={styles.closeIconContainer}>
        <XIcon
          className={styles.icon}
          name='window-closed'
          onClick={props.onCancel}
        />
        <XIcon
          className={styles.hoverIcon}
          name='window-closed-hover'
          onClick={props.onCancel}
        />
      </div>
      <div className={styles.fullPage}>
        {/* @ts-expect-error */}
        <DisplayerComponent
          {...props}
          className={styles.displayer}
        />
      </div>
    </div>
  )
}

const useVideoImgModal = () => useDisplayerModal(ModalBody)

export default useVideoImgModal
