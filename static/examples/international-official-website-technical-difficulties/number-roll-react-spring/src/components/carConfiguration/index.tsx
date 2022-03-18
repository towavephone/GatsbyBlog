import React, { ReactNode, useRef, useEffect } from 'react';
import classnames from 'classnames';
import { a, useTrail, useSprings, useSpringRef } from '@react-spring/web';
import { useInViewport } from 'ahooks';

import { delayFunc } from '../../utils';

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
    // @ts-expect-error
    data.map((item: NumberContent) => ({
      ref: springsRef,
      from: {
        number: 0
      },
      to: {
        number: Number(item.number)
      }
    }))
  );

  const domRef = useRef(null);
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
  }, [inViewPort]);

  return (
    <div ref={domRef} className={classnames(PageStyles.configuration, className, 'car-configuration')}>
      {trails.map((style, index) => {
        const item = data[index];
        // @ts-expect-error
        let title: ReactNode = item.title;
        const titleComponent = (
          <>
            <span
              className={PageStyles.configurationTitle}
              key={Math.random()}
              // @ts-expect-error
              dangerouslySetInnerHTML={{ __html: item.title }}
            />
            <span
              className={PageStyles.unit}
              key={Math.random()}
              // @ts-expect-error
              dangerouslySetInnerHTML={{ __html: item.unit }}
            />
          </>
        );
        const numberItem = item;
        // @ts-expect-error
        if (!title && numberItem.number) {
          // @ts-expect-error
          const renderFunc = numberItem.render
            ? // @ts-expect-error
              numberItem.render
            : // @ts-expect-error
              (value: number) => value.toFixed(numberItem.precision || 0);
          title = (
            <>
              <a.span>
                {/* @ts-expect-error */}
                {springs[index].number.to(renderFunc)}
              </a.span>
              <span
                className={PageStyles.unit}
                key={Math.random()}
                // @ts-expect-error
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
