import { useAsyncEffect } from 'ahooks';
import AMapLoader from '@amap/amap-jsapi-loader';

const lastCircleMarkers = [];

const useDrawPoints = ({ map, data = [] }) => {
  useAsyncEffect(async () => {
    if (!map) {
      return;
    }

    await AMapLoader.load({
      AMapUI: {
        version: '1.1',
        plugins: ['overlay/SvgMarker']
      }
    });

    // 当前环境并不支持 SVG，此时 SvgMarker 会回退到父类，即 SimpleMarker
    if (!window.AMapUI.SvgMarker.supportSvg) {
      console.log('window.AMapUI.SvgMarker.supportSvg', window.AMapUI.SvgMarker.supportSvg);
    }

    const shape = new window.AMapUI.SvgMarker.Shape.Circle({
      radius: 5,
      strokeColor: 'white',
      strokeWidth: 1,
      fillColor: '#f5222d'
    });

    if (lastCircleMarkers && lastCircleMarkers.length > 0) {
      lastCircleMarkers.forEach((item) => {
        item.destroy();
      });
    }

    data.forEach((position) => {
      const circleMarker = new window.AMapUI.SvgMarker(shape, {
        position,
        clickable: true
      });
      circleMarker.setMap(map);
      lastCircleMarkers.push(circleMarker);
    });
  }, [map, data]);
};

export default useDrawPoints;
