import { useEffect } from 'react';

const lastCircleMarkers = [];

const useDrawPoints = ({ map, data = [] }) => {
  useEffect(() => {
    if (!map) {
      return;
    }

    if (lastCircleMarkers && lastCircleMarkers.length > 0) {
      lastCircleMarkers.forEach((item) => {
        item.destroy();
      });
    }

    data.forEach((center) => {
      const circleMarker = new window.AMap.CircleMarker({
        center,
        radius: 5, // 3D视图下，CircleMarker半径不要超过64px
        strokeColor: 'white',
        strokeWeight: 2,
        // strokeOpacity: 0.5,
        fillColor: '#f5222d',
        // fillOpacity: 0.5,
        zIndex: 10,
        bubble: true,
        cursor: 'pointer',
        clickable: true
      });
      circleMarker.setMap(map);
      lastCircleMarkers.push(circleMarker);
    });
  }, [map, data]);
};

export default useDrawPoints;
