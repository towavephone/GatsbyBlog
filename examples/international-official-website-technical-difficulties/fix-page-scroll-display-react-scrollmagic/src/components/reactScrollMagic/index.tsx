import React, { Children, cloneElement, ReactElement } from 'react';
import { Controller as XPController, Scene, SceneProps as XPSceneProps } from 'react-scrollmagic';

import { getWindowHeight } from '../../utils';

const defaultControllerProps = {
  // container: getDocument()?.querySelector('h')
};

const defaultSceneProps = {
  indicators: false,
  triggerHook: 0,
  pin: true,
  duration: getWindowHeight()
};

interface ProgressEventsParams {
  progress: number;
  event: {
    state: string;
    type: string;
  };
}

export interface SceneProps {
  sceneProps?: (Partial<XPSceneProps> & { enableParams: boolean }) | null;
  sceneParams?: ProgressEventsParams;
}

interface ControllerProps {
  children: Array<ReactElement<SceneProps>> | ReactElement<SceneProps>;
}

const ReactScrollMagic = ({ children }: ControllerProps) => {
  const renderChildren = Children.map(children, (item) => {
    const sceneProps = {
      ...defaultSceneProps,
      ...item.props.sceneProps
    };
    if (sceneProps.enableParams) {
      const { enableParams, ...rest } = sceneProps;
      return (
        <Scene {...rest}>
          {(progress: number, event: { state: string }) => {
            return (
              <div>
                {cloneElement(item, {
                  ...item.props,
                  sceneParams: {
                    progress,
                    event
                  }
                })}
              </div>
            );
          }}
        </Scene>
      );
    }
    return (
      <Scene {...sceneProps}>
        <div>{item}</div>
      </Scene>
    );
  });
  return <XPController {...defaultControllerProps}>{renderChildren}</XPController>;
};

export default ReactScrollMagic;
