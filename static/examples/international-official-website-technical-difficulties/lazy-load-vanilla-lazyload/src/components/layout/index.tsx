import React, { useRef } from 'react';
import { Button } from 'antd'

import { l, ClickVideoModalPlayRef } from '@/components/lazyLoader'
import { LazyLoaderProvider } from '@/components/lazyLoader/lazyLoaderContext'

import '@/iconfont';

import styles from './index.module.less';

const Index = () => {
  const videoRef = useRef<ClickVideoModalPlayRef>(null)
  return (
    <LazyLoaderProvider>
      <div className={styles.container}>
        <div className={styles.displayerContainer}>
          <div>
            l.img
          </div>
          <div>
            <l.img
              src="/GATSBY_PUBLIC_DIR/public/images/placeholder.png"
              srcSet="/GATSBY_PUBLIC_DIR/public/images/placeholder@2x.png"
              minSrcSet="/GATSBY_PUBLIC_DIR/public/images/placeholder@mini.png"
            />
          </div>
          <div>
            l.div
          </div>
          <l.div
            src="/GATSBY_PUBLIC_DIR/public/images/placeholder.png"
            srcSet="/GATSBY_PUBLIC_DIR/public/images/placeholder@2x.png"
            minSrcSet="/GATSBY_PUBLIC_DIR/public/images/placeholder@mini.png"
          >
            2323
          </l.div>
          <div>
            l.video
          </div>
          <div>
            <div>
              默认自动播放
            </div>
            <l.video
              src="/GATSBY_PUBLIC_DIR/public/videos/cat.mp4"
              srcSet="/GATSBY_PUBLIC_DIR/public/videos/cat@2x.mp4"
              minSrcSet="/GATSBY_PUBLIC_DIR/public/videos/cat@mini.mp4"
            />
            <div>
              点击播放
            </div>
            <l.video
              playStrategy="clickPlay"
              src="/GATSBY_PUBLIC_DIR/public/videos/cat.mp4"
            />
            <div>
              点击视频弹窗播放
            </div>
            <div>
              <Button
                type="primary"
                onClick={() => videoRef.current?.openModal()}
              >
                打开弹窗
              </Button>
            </div>
            <l.video
              ref={videoRef}
              playStrategy="clickVideoModalPlay"
              src="/GATSBY_PUBLIC_DIR/public/videos/cat.mp4"
              longSrc="/GATSBY_PUBLIC_DIR/public/videos/cat@long.mp4"
            />
            <div>
              悬停播放
            </div>
            <l.video
              playStrategy="mouseOverPlay"
              src="/GATSBY_PUBLIC_DIR/public/videos/cat.mp4"
            />
            <div>
              进度控制（帧控制专用）
            </div>
            <l.video
              playStrategy="progressControl"
              src="/GATSBY_PUBLIC_DIR/public/videos/cat.mp4"
            />
            <div>
              进入视口播放一次
            </div>
            <l.video
              playStrategy="inViewportPlay"
              src="/GATSBY_PUBLIC_DIR/public/videos/cat.mp4"
            />
            <div>
              点击图片弹窗播放（默认图标）
            </div>
            <l.video
              className={styles.displayer}
              playStrategy="clickImgModalPlay"
              src="/GATSBY_PUBLIC_DIR/public/videos/cat.mp4"
              srcPoster="/GATSBY_PUBLIC_DIR/public/images/placeholder.png"
            />
            <div>
              点击图片弹窗播放（自定义图标）
            </div>
            <l.video
              className={styles.displayer}
              playStrategy="clickImgModalPlay"
              src="/GATSBY_PUBLIC_DIR/public/videos/cat.mp4"
              srcPoster="/GATSBY_PUBLIC_DIR/public/images/placeholder.png"
              playIconPosition="bottom"
            />
          </div>
        </div>
      </div>
    </LazyLoaderProvider>
  );
};

export default Index;
