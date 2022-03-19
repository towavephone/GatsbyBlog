import React from 'react';
import { Tween, PlayState } from 'react-gsap';

import ReactScrollMagic, { SceneProps } from '../reactScrollMagic';

import { getWindowHeight } from '../../utils';
import { getAnimateProgresses } from '../../utils/animate';

import styles from './index.module.less';

const Page = ({ sceneParams }: SceneProps) => {
  const { progress = 0 } = sceneParams || {};

  const [animationTextProgress] = getAnimateProgresses(progress, [
    {
      start: 1 / 2,
      duration: 1 / 2
    }
  ]);

  return (
    <div className={styles.pageContainer}>
      {animationTextProgress > 0 && (
        <div className={styles.animationBg}>
          <Tween
            from={{
              scale: 20
            }}
            totalProgress={animationTextProgress}
            playState={PlayState.pause}
          >
            <div className={styles.animationText}>hello</div>
          </Tween>
        </div>
      )}
    </div>
  );
};

const Index = () => {
  return (
    <div className={styles.container}>
      <div className={styles.fullPage} />
      <ReactScrollMagic>
        <Page
          sceneProps={{
            enableParams: true,
            duration: getWindowHeight() * 2
          }}
        />
      </ReactScrollMagic>
      <div className={styles.fullPage} />
    </div>
  );
};

export default Index;
