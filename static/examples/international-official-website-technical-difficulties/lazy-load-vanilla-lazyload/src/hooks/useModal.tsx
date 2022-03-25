import React, {
  useRef,
  forwardRef,
  useState,
  useImperativeHandle,
  useCallback,
  ComponentType,
  PropsWithoutRef
} from 'react';
import { ModalProps, Modal } from 'antd';

type ModalRefType<T> =
  | {
      open: (initProp?: Partial<T>) => void;
      close: () => void;
    }
  | undefined;

interface UseModalProps<T> {
  component: ComponentType<T>; // 子组件
  modalProps?: Partial<ModalProps>; // 弹窗属性
}

const useModal = function<T>({ component: Component, modalProps }: UseModalProps<T>) {
  const modalRef = useRef<ModalRefType<T>>();
  const [globalVisible, setGlobalVisible] = useState(false);

  const ComponentModal = forwardRef<ModalRefType<T>, T>((componetProps, componentRef) => {
    const [visible, setVisible] = useState(false);
    const [componentInitProp, setComponentInitProp] = useState<Partial<T>>();

    const handleOk = (initProps?: Partial<T>) => {
      if (initProps) {
        setComponentInitProp(initProps);
      }
      setVisible(true);
      setGlobalVisible(true);
    };

    const handleCancel = () => {
      setVisible(false);
      setGlobalVisible(false);
    };

    useImperativeHandle(componentRef, () => ({
      open: handleOk,
      close: handleCancel
    }));

    return (
      <Modal onCancel={handleCancel} visible={visible} {...modalProps}>
        <Component onCancel={handleCancel} {...componetProps} {...componentInitProp} />
      </Modal>
    );
  });

  return {
    Slot: useCallback((props: PropsWithoutRef<T>) => {
      return <ComponentModal ref={modalRef} {...props} />;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
    // 这里不能传 modalRef.current，因为传递的是引用
    // 如果传的是 modalRef.current，会导致 modelRef.current 更新时不会同步更新到外部
    api: modalRef,
    visible: globalVisible
  };
};

export default useModal;
