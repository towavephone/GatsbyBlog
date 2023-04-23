import React, { useEffect, useRef, useState } from 'react';
import { InputNumber, Button } from 'antd';

import styles from './index.module.less';

const Index = () => {
  const domRef = useRef(null);
  const [apngApi, setApngApi] = useState();
  const [value, setValue] = useState(0);

  useEffect(() => {
    import('@/lib/pixi-apng').then((pixiApng) => {
      const PixiApng = pixiApng.default;
      const { PIXI } = pixiApng;
      const app = new PIXI.Application({
        width: domRef.current.width,
        height: domRef.current.height,
        view: domRef.current,
        transparent: true,
        antialias: true
      });
      const loader = PIXI.Loader.shared;
      const loadOption = {
        loadType: PIXI.LoaderResource.LOAD_TYPE.XHR,
        xhrType: PIXI.LoaderResource.XHR_RESPONSE_TYPE.BUFFER,
        crossOrigin: ''
      };
      const imgs = {
        // apng: `http://localhost:3000/images/demo.png`
        apng: `/GATSBY_PUBLIC_DIR/public/images/demo.png`
      };
      loader.add(imgs.apng, loadOption);

      loader.load((progress, resources) => {
        const apngApi = new PixiApng(imgs.apng, resources);
        setApngApi(apngApi);
        const apngSprite = apngApi.sprite;

        apngSprite.x = 0;
        apngSprite.y = 0;

        apngSprite.width = 1000;
        apngSprite.height = 500;

        app.stage.addChild(apngSprite);
      });
    });
  }, []);

  // console.log('fasf', apngApi);

  return (
    <div>
      <Button
        type='primary'
        onClick={() => {
          apngApi.play();
        }}
      >
        开始
      </Button>
      <Button
        type='primary'
        onClick={() => {
          apngApi.pause();
        }}
      >
        停止
      </Button>
      <Button
        type='primary'
        onClick={() => {
          apngApi.stop();
        }}
      >
        终止
      </Button>
      <InputNumber value={value} onChange={setValue} precision={0} />
      <Button
        type='primary'
        onClick={() => {
          apngApi.jumpToFrame(value);
        }}
      >
        停到第几帧
      </Button>
      <Button
        type='primary'
        onClick={() => {
          window.alert(apngApi.getDuration());
        }}
      >
        时长
      </Button>
      <Button
        type='primary'
        onClick={() => {
          window.alert(apngApi.getFramesLength());
        }}
      >
        帧数
      </Button>
      <canvas ref={domRef} className={styles.canvas} width='1000' height='500'></canvas>
    </div>
  );
};

export default Index;
