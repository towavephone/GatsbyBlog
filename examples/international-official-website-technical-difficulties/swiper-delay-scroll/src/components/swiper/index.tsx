import { Swiper, SwiperSlide } from '@towavephone/swiper/react'
import SwiperCore, { Autoplay, Mousewheel, EffectFade, Lazy } from '@towavephone/swiper/core'
import type SwiperClass from '@towavephone/swiper/types/swiper-class'

import '@towavephone/swiper/swiper.min.css'
import '@towavephone/swiper/components/effect-fade/effect-fade.min.css'

SwiperCore.use([Autoplay, Mousewheel, EffectFade, Lazy])

export { SwiperSlide, Swiper, SwiperClass }
