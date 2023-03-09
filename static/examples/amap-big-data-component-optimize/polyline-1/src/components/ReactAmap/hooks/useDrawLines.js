import { debounce, get } from 'lodash';
import { useAsyncEffect, useLatest } from 'ahooks';
import { useEffect } from 'react';

import { requestHostCallback, shouldYieldToHost, requestHostTimeout, cancelHostCallback } from '@/utils/SchedulerHostConfig';

const SIZE = 50;

const batchRender = (map, lines) => {
  const size = SIZE;
  const totalPage = Math.ceil(lines.length / size);

  const render = () => {
    let page = 0;
    return () => {
      if (shouldYieldToHost() || page >= totalPage) {
        console.log('shouldYieldToHost', page);
        return;
      }
      const splitLines = lines.slice(page * size, page * size + size);
      if (page + 1 >= totalPage) {
        console.log('draw polylines length', lines.length);
      }
      map.add(splitLines);
      page++;
      return page < totalPage;
    };
  };

  requestHostCallback(render());
};

const handleClearLines = (map, clearLines) => {
  (function(clearLines) {
    if (clearLines && clearLines.length > 0) {
      const size = SIZE;
      const totalPage = Math.ceil(clearLines.length / size);
      const clearFunc = (page) => {
        if (page >= totalPage) {
          return;
        }
        const splitLines = clearLines.slice(page * size, page * size + size);
        if (page + 1 >= totalPage) {
          console.log('remove polylines length', clearLines.length);
        }
        map.remove(splitLines);
        requestHostTimeout(() => clearFunc(page + 1), 0);
      };

      clearFunc(0);
    }
  })(clearLines);
};

let lastestRenderPolylines = [];

const renderLines = (map, data) => {
  const polylines = [];

  const bounds = map.getBounds();
  const NorthEast = bounds.getNorthEast();
  const SouthWest = bounds.getSouthWest();
  const SouthEast = [NorthEast.lng, SouthWest.lat];
  const NorthWest = [SouthWest.lng, NorthEast.lat];
  const ring = [[NorthEast.lng, NorthEast.lat], SouthEast, [SouthWest.lng, SouthWest.lat], NorthWest];

  handleClearLines(map, lastestRenderPolylines);

  const inViewportData = data.filter((item) =>
    item.path.some((item2) => window.AMap.GeometryUtil.isPointInRing(item2, ring))
  );

  inViewportData.forEach((item) => {
    const { path = [], isSuccess, name, id } = item;
    const polyline = new window.AMap.Polyline({
      path,
      showDir: true,
      strokeColor: isSuccess ? '#36f' : '#f50',
      strokeWeight: 5,
      extData: {
        id,
        name
      },
      lineJoin: 'round',
      lineCap: 'round',
      cursor: 'pointer'
    });
    polylines.push(polyline);
  });
  batchRender(map, polylines);
  lastestRenderPolylines = polylines;
  // console.log('total polylines length', polylines.length);
};

const START_EVENTS = ['zoomstart', 'movestart'];
const END_EVENTS = ['zoomend', 'moveend', 'resize'];

const Index = ({ map, data }) => {
  const dataRef = useLatest(data);

  useAsyncEffect(async () => {
    if (!map) {
      return;
    }

    const handleStartEvents = () => {
      console.log('cancelHostCallback')
      cancelHostCallback()
    }

    const handleEndEvents = debounce((...param) => {
      console.log('renderLines start', param);
      renderLines(map, dataRef.current);
    }, 1000);

    START_EVENTS.forEach((event) => {
      console.log('add start event', event);
      map.on(event, handleStartEvents);
    });
  
    END_EVENTS.forEach((event) => {
      console.log('add end event', event);
      map.on(event, handleEndEvents);
    });

    return () => {
      START_EVENTS.forEach((event) => {
        console.log('remove start event', event);
        map.clearEvents(event);
      });

      END_EVENTS.forEach((event) => {
        console.log('remove end event', event);
        map.clearEvents(event);
      });
    };
  }, [map]);

  useEffect(() => {
    if (!map) {
      return;
    }

    const firstPoint = get(data, '0.path.0');
    if (firstPoint) {
      const [lng, lat] = firstPoint;
      // 这里由 moveend 去触发
      map.setCenter(new window.AMap.LngLat(lng, lat));
    }
  }, [map, data]);
};

export default Index;
