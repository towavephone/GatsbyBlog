import AMapLoader from '@amap/amap-jsapi-loader'
import { useEffect, useState } from 'react'
import { useAsyncEffect } from 'ahooks'

const useDrawLines = ({ map, data, getHoverTitle, onPathMouseOut = () => {}, onPathMouseOver = () => {}, onPointMouseOut = () => {}, onPointMouseOver = () => {} }) => {
  const [pathSimplifier, setPathSimplifier] = useState(null)

  useAsyncEffect(async () => {
    if (!map) {
      return
    }

    await AMapLoader.load({
      AMapUI: {
        version: '1.1',
        plugins: ['misc/PathSimplifier']
      }
    })

    const pathSimplifierIns = new window.AMapUI.PathSimplifier({
      zIndex: 100,
      autoSetFitView: true,
      map, // 所属的地图实例
      getPath: pathData => pathData.path,
      getHoverTitle,
      clickToSelectPath: false,
      renderOptions: {
        pathLineStyle: {
          dirArrowStyle: true,
          borderWeight: 2,
          borderStyle: '#fef'
        },
        pathTolerance: 2,
        eventSupportInvisible: false,
        pathLineHoverStyle: {
          strokeStyle: '#faad14'
        },
        getPathStyle: (pathItem, zoom) => {
          const { color, path } = pathItem.pathData
          const lineWidth = Math.round(4 * Math.pow(1.1, zoom - 3))

          const pointStyle = {
            fillStyle: color,
            strokeStyle: path.length === 1 ? 'white' : null,
            radius: Math.floor(lineWidth / 2)
          }

          return {
            pathLineStyle: {
              strokeStyle: color,
              lineWidth
            },
            startPointStyle: pointStyle,
            endPointStyle: pointStyle
          }
        }
      }
    })

    pathSimplifierIns.on('pathMouseout', onPathMouseOut)
    pathSimplifierIns.on('pathMouseover', onPathMouseOver)

    pathSimplifierIns.on('pointMouseout', onPointMouseOut)
    pathSimplifierIns.on('pointMouseover', onPointMouseOver)

    setPathSimplifier(pathSimplifierIns)
  }, [map])

  useEffect(() => {
    if (!map || !pathSimplifier) {
      return
    }

    pathSimplifier.setData(data)
    // renderLines(pathSimplifier, data)
  }, [map, data, pathSimplifier])
}

export default useDrawLines
