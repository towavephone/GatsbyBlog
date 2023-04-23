import React from 'react';
import Helmet from 'react-helmet'

import { LazyLoaderProvider } from '@/components/lazyLoader/lazyLoaderContext'
import ReactScrollMagic, { SceneProps } from '@/components/reactScrollMagic';
import JsmpegPlayer from '@/components/jsmpegPlayer'

import { getAnimateProgresses } from '@/utils/animate';
import { getWindowHeight } from '@/utils';

import '@/iconfont';

import styles from './index.module.less';

const Page = ({ sceneParams }: SceneProps) => {
  const { progress = 0 } = sceneParams || {};

  const [playerProgress] = getAnimateProgresses(progress, [
    {
      start: 0,
      duration: 2 / 3
    }
  ])

  return (
    <div className={styles.fullPage}>
      <JsmpegPlayer
        className={styles.player}
        src="/GATSBY_PUBLIC_DIR/public/videos/p5-inside.mpeg"
        poster="/GATSBY_PUBLIC_DIR/public/videos/p5-inside-first-frame.jpg"
        progress={playerProgress}
      />
    </div>
  );
};

const Index = () => {
  return (
    <LazyLoaderProvider>
      <Helmet title="序列帧滚动控制——jsmpeg" />
      <div className={styles.container}>
        <div className={styles.fullPage} />
        <ReactScrollMagic>
          <Page
            sceneProps={{
              enableParams: true,
              duration: getWindowHeight() * 3
            }}
          />
        </ReactScrollMagic>
        <div className={styles.fullPage} />
      </div>
    </LazyLoaderProvider>
  );
};

export default Index;
