import React from 'react';

import AnimationTitle from '../animationTitle';
import ConfigContext from './configContext';

import '../../iconfont';

import styles from './index.module.less';

const Index = () => {
  return (
    <ConfigContext.Provider
      value={{
        isRunMultiTime: true // 控制是否运行多次
      }}
    >
      <div className={styles.container}>
        <AnimationTitle
          className={styles.animationTitle}
          title={<div className={styles.title}>Title</div>}
          subTitle={[
            <div className={styles.subTitle1}>subTilte1</div>,
            <div className={styles.subTitle1}>subTilte2</div>,
            <div className={styles.subTitle1}>subTilte3</div>
          ]}
        />
      </div>
    </ConfigContext.Provider>
  );
};

export default Index;
