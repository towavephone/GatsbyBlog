import React, { Children, cloneElement, useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import produce from 'immer';

import { getDocument } from '../../utils';

if (getDocument()) {
  import('gsap/ScrollTrigger').then((component) => {
    const ScrollTrigger = component.default;
    gsap.registerPlugin(ScrollTrigger);
  });
}

const ReactScrollMagic = ({ children }) => {
  const revealRefs = useRef([]);
  const [updateParams, setUpdateParams] = useState([]);
  revealRefs.current = [];

  useEffect(() => {
    revealRefs.current.forEach((el, index) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          pin: true,
          start: 'top top',
          end: '+=300%',
          markers: false,
          anticipatePin: 2,
          onUpdate: (self) => {
            // console.log(
            //   self,
            //   'progress:',
            //   self.isActive,
            //   self.progress.toFixed(3),
            //   'direction:',
            //   self.direction,
            //   'velocity',
            //   self.getVelocity()
            // );
            const { progress, isActive } = self;
            setUpdateParams(
              produce((draftState) => {
                draftState[index] = {
                  progress,
                  isActive
                };
              })
            );
          }
        }
      });
    });
  }, []);

  const addToRefs = (el, index) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current[index] = el;
    }
  };

  return Children.map(children, (item, index) => {
    // const sceneProps = {
    //   ...defaultSceneProps,
    //   ...item.props.sceneProps
    // }
    return (
      <div ref={(el) => addToRefs(el, index)}>
        {cloneElement(item, {
          ...item.props,
          sceneParams: updateParams[index] || {}
        })}
      </div>
    );
  });
};

export default ReactScrollMagic;
