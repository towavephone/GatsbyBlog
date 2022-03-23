import React from 'react';

import useScrollDirection from '@/hooks/useScrollDirection';

import { getWindowHeight } from '@/utils';

import styles from './index.module.less';

const Index = () => {
  const { scrollYDirection } = useScrollDirection(() => document, ({ top }) => top > getWindowHeight());
  return (
    <div className={styles.container}>
      <div className={styles.fullPage} />
      <div className={styles.fullPage} />
      <div className={styles.fullPage} />
      <div className={styles.fullPage} />
      <div className={styles.text}>
        <div>{scrollYDirection || 'none'}</div>
        <div>一屏之后才会有滚动状态的变更</div>
      </div>
    </div>
  );
};

export default Index;
