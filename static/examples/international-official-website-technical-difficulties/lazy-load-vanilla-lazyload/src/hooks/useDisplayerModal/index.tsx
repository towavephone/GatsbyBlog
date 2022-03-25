import { ComponentType } from 'react';

import useModal from '@/hooks/useModal';

import styles from './index.module.less';

const useDisplayerModal = function<T>(Component: ComponentType<T>) {
  const result = useModal({
    component: Component,
    modalProps: {
      className: styles.modal,
      wrapClassName: styles.wrapClassName,
      closable: false,
      footer: null,
      // 这里 destroyOnClose 设置 true 的原因是：swiper 需要销毁，否则导致 swiper 卡住的 bug
      destroyOnClose: true,
      centered: false
    }
  });
  return result;
};

export default useDisplayerModal;
