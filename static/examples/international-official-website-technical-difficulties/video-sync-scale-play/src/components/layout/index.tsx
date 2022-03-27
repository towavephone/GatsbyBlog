import React from 'react';
import Helmet from 'react-helmet'

import { LazyLoaderProvider } from '@/components/lazyLoader/lazyLoaderContext'
import ReactScrollMagic, { SceneProps } from '@/components/reactScrollMagic';
import LearnMore from '@/components/learnMore'

import ConfigContext from './configContext';

import '@/iconfont';

import styles from './index.module.less';

const Index = () => {
  return (
    <ConfigContext.Provider
      value={{
        isRunMultiTime: true // 控制是否运行多次
      }}
    >
      <LazyLoaderProvider>
        <Helmet title="视频进度同步 / 缩放动效" />
        <div className={styles.container}>
          <div className={styles.fullPage} />
          <ReactScrollMagic>
            <LearnMore
              sceneProps={{
                enableParams: true
              }}
            />
          </ReactScrollMagic>
          <div className={styles.fullPage} />
        </div>
      </LazyLoaderProvider>
    </ConfigContext.Provider>
  );
};

export default Index;
