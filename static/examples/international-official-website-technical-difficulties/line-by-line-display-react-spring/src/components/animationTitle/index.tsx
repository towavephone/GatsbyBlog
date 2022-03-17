import React, { CSSProperties, ReactNode, Children, useRef, useEffect, useContext } from 'react';
import classnames from 'classnames';
import { a, useTransition, useSpringRef, useSpring } from '@react-spring/web';
import { useInViewport } from 'ahooks';

import XIcon from '../xIcon';
import ConfigContext from '../layout/configContext';
import { delayFunc } from '../../utils';

import styles from './index.module.less';

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
    enter: (_, i) => ({
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
    // @ts-expect-error
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
  }, [inViewPort, isOnce, title, subTitle]);

  const getStyle = (style: any) => (animation ? style : undefined);

  return (
    <div ref={domRef} className={classnames(styles.textDisplay, 'text-display', className)} style={style}>
      {closeIcon && (
        <a.div style={getStyle(closeIconStyle)} className={classnames(styles.closeIcon, 'close-icon')}>
          {closeIcon}
        </a.div>
      )}
      {title && (
        <a.div style={getStyle(titleStyle)} className={classnames(styles.title, 'text-display-title')}>
          {title}
        </a.div>
      )}
      {subTitle && (
        <div className={classnames(styles.subTitleContainer, 'text-display-sub-title-container')}>
          {transitions((style, item: any) => {
            return (
              <a.div style={getStyle(style)} className={classnames(styles.subTitle, 'text-display-sub-title')}>
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
