import AMapLoader from '@amap/amap-jsapi-loader';
import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { useAsyncEffect } from 'ahooks';
import { get } from 'lodash';

import useDrawLines from './hooks/useDrawLines';
import useDrawPoints from './hooks/useDrawPoints';

import styles from './index.module.less';

// eslint-disable-next-line react/prop-types
const ReactAmap = ({ data = [], loading }, ref) => {
  const domRef = useRef(null);
  const [map, setMap] = useState();

  useImperativeHandle(
    ref,
    () => ({
      getMap: () => map
    }),
    [map]
  );

  useAsyncEffect(async () => {
    await AMapLoader.load({
      key: 'cc1b3b4a8dddb5dfbd6752a407dd8fc5',
      version: '2.0',
      plugins: ['AMap.Scale', 'AMap.ToolBar']
    });
    const map = new window.AMap.Map(domRef.current, {
      expandZoomRange: true
      // zooms: [3, 20]
    });
    map.addControl(new window.AMap.Scale());
    map.addControl(new window.AMap.ToolBar());
    map.on('complete', () => {
      setMap(map);
    });
  }, []);

  useDrawLines({
    map,
    data: get(data, 'polylines', [])
  });

  useDrawPoints({
    map,
    data: get(data, 'points', [])
  });

  return <div ref={domRef} className={styles.map} />;
};

export default forwardRef(ReactAmap);
