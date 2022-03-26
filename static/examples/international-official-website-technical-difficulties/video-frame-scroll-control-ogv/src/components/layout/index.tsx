import React from 'react';
import Helmet from 'react-helmet'

import ReactScrollMagic, { SceneProps } from '@/components/reactScrollMagic';
import OgvPlayer from '@/components/ogvPlayer'

import { getAnimateProgresses } from '@/utils/animate';
import { getWindowHeight } from '@/utils';

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
      <OgvPlayer
        className={styles.player}
        src="/GATSBY_PUBLIC_DIR/public/videos/p5-inside@vp9.webm"
        progress={playerProgress}
      />
    </div>
  );
};

const Index = () => {
  return (
    <>
      <Helmet title="序列帧滚动控制——ogvjs（vp9 编码的 webm 视频）" />
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
    </>
  );
};

export default Index;
