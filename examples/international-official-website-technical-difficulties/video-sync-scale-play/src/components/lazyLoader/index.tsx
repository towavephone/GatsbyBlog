import AutoFitImg from '@/components/autoFitImg'
import type { AutoFitImgProps } from '@/components/autoFitImg'

import { LazyLoaderProvider, LazyLoaderContext } from './lazyLoaderContext'
import Div from './components/div'
import type { DivProps } from './components/div'
import Video from './components/video'
import type { VideoProps, ClickVideoModalPlayRef, ClickImgModalPlayRef, CoreRef as VideoRef } from './components/video'
import useResetStatus from './hooks/useResetStatus'

/** example
<LazyLoaderProvider>
  <LazyLoader>
    <img
      data-src="/public/p7/highway-navigation/p7-p8-1.jpg"
      width="960px"
      height="720px"
    />
  </LazyLoader>
  <LazyLoader>
    <picture>
      <source media="min-width: 1440px" data-srcset="/public/p7/highway-navigation/p7-p8-2@2x.jpg" />
      <img
        className="lazy"
        data-src="/public/p7/highway-navigation/p7-p8-2.jpg"
        width="960px"
        height="720px"
      />
    </picture>
  </LazyLoader>
  <LazyLoader>
    <video
      data-src="/public/p7/design-for-tomorrow/P2.mp4"
      autoPlay
      muted
      loop
      width="960px"
      height="720px"
    />
  </LazyLoader>
  <LazyLoader>
    <iframe
      data-src="https://www.xiaopeng.com/"
      width="960px"
      height="720px"
    />
  </LazyLoader>
  <LazyLoader>
    <picture>
      <source media="(min-width: 1440px)" data-srcset="/public/p7/highway-navigation/p7-p8-2@2x.jpg" />
      <img
        className="lazy"
        data-src="/public/p7/highway-navigation/p7-p8-2.jpg"
        width="960px"
        height="720px"
      />
    </picture>
  </LazyLoader>
  <LazyLoader>
    <div
      data-bg="/public/p7/highway-navigation/p7-p8-2.jpg"
      width="960px"
      height="720px"
    >
    </div>
  </LazyLoader>
</LazyLoaderProvider>
*/

const lazyElement = {
  img: AutoFitImg,
  div: Div,
  video: Video
}

export {
  LazyLoaderProvider,
  LazyLoaderContext,
  useResetStatus,
  lazyElement,
  lazyElement as l,
  AutoFitImgProps as ImgProps,
  DivProps,
  VideoProps,
  ClickVideoModalPlayRef,
  ClickImgModalPlayRef,
  VideoRef
}
