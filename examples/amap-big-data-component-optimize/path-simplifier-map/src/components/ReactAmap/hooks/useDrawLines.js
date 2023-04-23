import { debounce, get } from 'lodash';
import { useAsyncEffect, useLatest } from 'ahooks';
import AMapLoader from '@amap/amap-jsapi-loader';
import { useEffect, useState } from 'react';

import { requestHostCallback, shouldYieldToHost } from '@/utils/SchedulerHostConfig';

const isPointInView = (map, lonLat) => {
  const bounds = map.getBounds();
  const NorthEast = bounds.getNorthEast();
  const SouthWest = bounds.getSouthWest();
  const SouthEast = [NorthEast.lng, SouthWest.lat];
  const NorthWest = [SouthWest.lng, NorthEast.lat];
  const path = [[NorthEast.lng, NorthEast.lat], SouthEast, [SouthWest.lng, SouthWest.lat], NorthWest];

  const isInView = window.AMap.GeometryUtil.isPointInRing(lonLat, path);
  return isInView;
};

const batchRender = (pathSimplifierIns, lines) => {
  const size = 100;
  const totalPage = Math.ceil(lines.length / size);

  const render = () => {
    let page = 0;
    return () => {
      if (shouldYieldToHost() || page >= totalPage) {
        console.log('shouldYieldToHost', page);
        return;
      }
      const splitLines = lines.slice(0, page * size + size);
      console.log('draw splitLines length', splitLines.length);
      // pathSimplifierIns.setDataImmediate(splitLines);
      pathSimplifierIns.setData(splitLines);
      page++;
      return page < totalPage;
    };
  };

  requestHostCallback(render());
};

const renderLines = (map, pathSimplifierIns, data) => {
  const polylines = [];
  data.forEach((item) => {
    const { path = [], isSuccess, name } = item;
    const polyline = {
      name,
      path,
      pathLineStyle: {
        strokeStyle: isSuccess ? '#36f' : '#f50'
      }
    };

    const isInView = path.some((item2) => isPointInView(map, item2));
    if (!isInView) {
      return;
    }
    polylines.push(polyline);
  });
  // pathSimplifierIns.setDataImmediate(polylines)
  batchRender(pathSimplifierIns, polylines);
  console.log('total polylines length', polylines.length);
};

const END_EVENTS = ['zoomend', 'moveend', 'resize'];

const loadMyPathSimplifier = () => {
  return new Promise((resolve) => {
    window.AMapUI.load(['lib/utils'], function(utils) {
      // 新的Marker类
      function MyPathSimplifier(opts) {
        // 调用父级的构造方法
        MyPathSimplifier.__super__.constructor.call(this, opts);
        // ..额外的初始化逻辑..
      }

      // 继承SimpleMarker的功能
      utils.inherit(MyPathSimplifier, window.AMapUI.PathSimplifier);

      // 增加或者覆盖接口
      utils.extend(MyPathSimplifier.prototype, {
        // ..新的接口
        setDataImmediate(data) {
          this._buildData(data);
          this.render();
        }
      });

      resolve({
        MyPathSimplifier
      });
    });
  });
};

const Index = ({ map, data }) => {
  const dataRef = useLatest(data);
  const [pathSimplifier, setPathSimplifier] = useState(null);

  useAsyncEffect(async () => {
    if (!map) {
      return;
    }

    await AMapLoader.load({
      AMapUI: {
        version: '1.1',
        plugins: ['misc/PathSimplifier']
      }
    });

    const { MyPathSimplifier } = await loadMyPathSimplifier();

    const emptyLineStyle = {
      lineWidth: 0,
      fillStyle: null,
      strokeStyle: null,
      borderStyle: null
    };
    const pathSimplifierIns = new MyPathSimplifier({
      zIndex: 100,
      autoSetFitView: false,
      map, // 所属的地图实例
      getPath: (pathData) => pathData.path,
      getHoverTitle: (pathData) => {
        return pathData.name;
      },
      renderOptions: {
        pathLineStyle: {
          dirArrowStyle: true,
          borderWeight: 2,
          borderStyle: '#fef'
        },
        // keyPointTolerance: -1,
        pathTolerance: 2,
        eventSupportInvisible: false,
        pathLineHoverStyle: {
          strokeStyle: '#faad14'
        },
        startPointStyle: emptyLineStyle,
        endPointStyle: emptyLineStyle,
        getPathStyle: (pathItem, zoom) => {
          const { pathLineStyle } = pathItem.pathData;
          const lineWidth = Math.round(4 * Math.pow(1.1, zoom - 3));
          return {
            pathLineStyle: {
              ...pathLineStyle,
              lineWidth
            }
          };
        }
      }
    });

    const handleEndEvents = debounce((...param) => {
      console.log('event', param);
      renderLines(map, pathSimplifierIns, dataRef.current);
    }, 1000);
    END_EVENTS.forEach((event) => {
      console.log('add event', event);
      map.on(event, handleEndEvents);
    });

    setPathSimplifier(pathSimplifierIns);

    return () => {
      END_EVENTS.forEach((event) => {
        console.log('remove event', event);
        map.clearEvents(event);
      });
    };
  }, [map]);

  useEffect(() => {
    if (!map || !pathSimplifier) {
      return;
    }

    const firstPoint = get(data, '0.path.0');
    if (firstPoint) {
      const [lng, lat] = firstPoint;
      // 这里由 moveend 去触发
      map.setCenter(new window.AMap.LngLat(lng, lat));
    }
  }, [map, data, pathSimplifier]);
};

export default Index;
