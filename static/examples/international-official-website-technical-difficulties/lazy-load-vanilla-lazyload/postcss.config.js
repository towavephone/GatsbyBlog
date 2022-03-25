module.exports = {
  plugins: {
    '@our-patches/postcss-px-to-viewport': {
      // https://github.com/evrone/postcss-px-to-viewport/blob/master/README_CN.md
      unitToConvert: 'px', // 需要转换的单位，默认为"px"
      viewportWidth: 1920, // 视窗的宽度，对应设计稿的宽度
      unitPrecision: 8, // 指定 px 转换为视窗单位值的小数后 x 位数，转换精度尽可能的大，防止出现图片比例问题
      viewportUnit: 'rem', // 希望使用的视口单位
      fontViewportUnit: 'rem', // 字体使用的视口单位,
      minPixelValue: 1, // 最小的转换数值
      mediaQuery: true, // 媒体查询里的单位是否需要转换单位
      selectorBlackList: [/^html$/, 'hack'],
      exclude: /node_modules/,
      include: [/(\\|\/)src(\\|\/)/]
    },
    // 此插件主要修复了移动端 100vh 的高度（即减去搜索框的高度）
    // 效果：https://codepen.io/team/css-tricks/full/vapjge
    // https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
    'postcss-viewport-height-correction': {}
  }
};
