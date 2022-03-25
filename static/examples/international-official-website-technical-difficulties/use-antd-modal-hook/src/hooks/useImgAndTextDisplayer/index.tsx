import React from 'react';

import XIcon from '@/components/xIcon';

import useDisplayerModal from '../useDisplayerModal';

import styles from './index.module.less';

interface ImgAndTextDisplayerProps {
  data: string[];
}

interface ModalBodyProps extends ImgAndTextDisplayerProps {
  onCancel?: () => void;
}

const ImgAndTextDisplayer = (props: ModalBodyProps) => {
  return (
    <ol>
      {props.data.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ol>
  );
};

const ModalBody = (props: ModalBodyProps) => (
  <div className={styles.container}>
    <XIcon name='cancel' className={styles.closeIcon} onClick={props.onCancel} />
    <div className='full-page'>
      <div className='body'>
        <ImgAndTextDisplayer {...props} />
      </div>
    </div>
  </div>
);

const useImgAndTextDisplayer = () => useDisplayerModal(ModalBody);

export default useImgAndTextDisplayer;
