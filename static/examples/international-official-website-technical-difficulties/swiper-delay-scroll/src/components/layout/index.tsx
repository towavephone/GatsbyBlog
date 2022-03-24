import React from 'react';

import { Swiper, SwiperSlide } from '@/components/swiper'

import styles from './index.module.less';

const Index = () => {
  return (
    <Swiper
      className={styles.swiper}
      direction='vertical'
      mousewheel={{
        enableDelayScroll: true
      }}
      speed={2000}
    >
      <SwiperSlide>
        Slide 1
      </SwiperSlide>
      <SwiperSlide>
        Slide 2
      </SwiperSlide>
      <SwiperSlide>
        Slide 3
      </SwiperSlide>
      <SwiperSlide>
        Slide 4
      </SwiperSlide>
    </Swiper>
  );
};

export default Index;
