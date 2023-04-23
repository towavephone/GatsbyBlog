import React from 'react';

import CarConfiguration from '../carConfiguration';

import styles from './index.module.less';

const Index = () => {
  return (
    <div className={styles.container}>
      <CarConfiguration
        data={[
          {
            number: '500',
            unit: 'km',
            hint: '里程数'
          },
          {
            number: '9.2',
            precision: 1,
            unit: 't<sup>1</sup>',
            hint: '吨数'
          },
          {
            title: '自动驾驶系统',
            hint: '智能'
          }
        ]}
      />
    </div>
  );
};

export default Index;
