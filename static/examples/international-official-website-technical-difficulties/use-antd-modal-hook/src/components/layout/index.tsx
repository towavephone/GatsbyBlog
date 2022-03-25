import React from 'react';
import { Button } from 'antd';

import useImgAndTextDisplayer from '@/hooks/useImgAndTextDisplayer';

import '@/iconfont';

import styles from './index.module.less';

const Index = () => {
  const { api, Slot } = useImgAndTextDisplayer();
  return (
    <div className={styles.container}>
      <Slot data={['嘎达嘎嘎', '宏观环境', '集体经济']} />
      <Button className={styles.button} type='primary' onClick={() => api.current?.open()}>
        打开弹窗
      </Button>
    </div>
  );
};

export default Index;
