
import React, { ReactNode, useRef } from 'react'
import classNames from 'classnames'

import useResetStatus from '../../hooks/useResetStatus'
import useSrcSet, { UseSrcSetProps } from '../../hooks/useSrcSet'

export type DivProps = JSX.IntrinsicElements['div'] & UseSrcSetProps & {
  children?: ReactNode
}

const Div = ({
  src,
  srcSet,
  minSrcSet,
  children,
  className,
  ...rest
}: DivProps) => {
  const currentSrc = useSrcSet({
    src,
    srcSet,
    minSrcSet
  })

  const domRef = useRef(null)
  useResetStatus(domRef, [currentSrc])

  return (
    <div
      {...rest}
      ref={domRef}
      className={classNames('lazy', className)}
      data-bg={currentSrc}
    >
      {children}
    </div>
  )
}

export default Div
