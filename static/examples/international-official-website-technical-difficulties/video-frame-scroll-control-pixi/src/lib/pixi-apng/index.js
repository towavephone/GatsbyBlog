// https://github.com/sbfkcel/pixi-apngAndGif

import * as PIXI from 'pixi.js';

import UPNG from './upng'; // png 图片编解码

const getExeName = (filePath) => {
  const aList = filePath.split('.');
  return aList[aList.length - 1];
};

class Image {
  constructor(esource, resources) {
    const _ts = this;
    _ts.esource = esource;
    _ts.resources = resources;

    _ts.init();
  }

  init() {
    const _ts = this;
    const esource = _ts.esource;
    const resources = _ts.resources;

    _ts.temp = {
      // 临时数据
      // loop:0,                                       // 保存当前需要播放的次数
      // tickerIsAdd:undefined                         // 保存轮循执行器是否添加
      events: {} // 用于存放事件
    };

    // 属性
    _ts.__attr = {
      autoPlay: true, // 默认自动播放
      loop: 0 // 默认无限次播放
    };

    // 方法
    _ts.__method = {
      play: _ts.play // 播放方法
    };

    // 状态
    _ts.__status = {
      status: 'init', // 状态，默认初始化（init、playing、played、pause、stop）
      frame: 0, // 当前帧数
      loops: 0, // 连续循环播放次数，停止播放会清0
      time: 0
    };

    // 循环执行器
    _ts.ticker = new PIXI.Ticker();
    _ts.ticker.stop();

    // 精灵
    _ts.sprite = this.createSprite(esource, resources);
  }

  // 播放
  play(loop, callback) {
    const _ts = this;

    // 没有纹理材质时抛出错误
    if (!_ts.textures.length) {
      throw new Error('没有可用的textures');
    }

    // 纹理材质只有一帧时不往下执行
    if (_ts.textures.length === 1) {
      return;
    }

    const status = _ts.__status;
    const attr = _ts.__attr;
    let time = 0;

    // 当状态是停止的时候，将播放次数清0
    if (status.status === 'stop') {
      status.loops = 0;
    }

    // 设置循环参数
    loop = typeof loop === 'number' ? loop : attr.loop;
    _ts.temp.loop = loop;
    attr.loop = loop;

    // 为轮循执行器添加一个操作
    if (!_ts.temp.tickerIsAdd) {
      _ts.ticker.add((deltaTime) => {
        const elapsed = PIXI.Ticker.shared.elapsedMS;
        time += elapsed;

        // 当帧停留时间已达到间隔帧率时播放下一帧
        if (time > _ts.framesDelay[status.frame]) {
          status.frame++;

          // 修改状态为执行中
          status.status = 'playing';

          // 当一次播放完成，将播放帧归0，并记录播放次数
          if (status.frame > _ts.textures.length - 1) {
            status.frame = 0;
            status.loops++;

            // 当指定了有效的播放次数并且当前播放次数达到指定次数时，执行回调则停止播放
            if (_ts.temp.loop > 0 && status.loops >= _ts.temp.loop) {
              if (typeof callback === 'function') {
                callback(status);
              }
              // 修改状态为执行完成并停止
              status.status = 'played';
              _ts.runEvent('played', status);
              _ts.stop();
            }
          }

          // 修改精灵纹理材质与当前的帧率相匹配
          _ts.sprite.texture = _ts.textures[status.frame];
          time = 0;

          _ts.runEvent('playing', status);
        }
      });
      _ts.temp.tickerIsAdd = true;
    }

    // 让轮循执行器开始执行
    _ts.ticker.start();
  }

  // 暂停
  pause() {
    const _ts = this;
    const status = _ts.__status;
    _ts.ticker.stop();
    status.status = 'pause';
    _ts.runEvent('pause', status);
  }

  // 停止播放并跳至第一帧
  stop() {
    const _ts = this;
    const status = _ts.__status;
    _ts.ticker.stop();
    status.status = 'stop';
    _ts.runEvent('stop', status);
  }

  // 跳至指定的帧数
  jumpToFrame(frameIndex) {
    const _ts = this;
    const textures = _ts.textures;

    // 没有纹理材质时抛出错误
    if (!textures.length) {
      throw new Error('没有可用的textures');
    }

    const status = _ts.__status;

    frameIndex = frameIndex < 0 ? 0 : frameIndex > textures.length - 1 ? textures.length - 1 : frameIndex;

    if (typeof frameIndex === 'number') {
      _ts.sprite.texture = textures[frameIndex];
      status.frame = frameIndex;
    }
  }

  // 获取总播放时长
  getDuration() {
    const _ts = this;
    const framesDelay = _ts.framesDelay;

    // 没有帧时间时抛出错误
    if (!framesDelay.length) {
      throw new Error('未找到图片帧时间');
    }

    let time = 0;

    for (let i = 0, len = framesDelay.length; i < len; i++) {
      time += framesDelay[i];
    }
    return time;
  }

  // 获取总帧数
  getFramesLength() {
    const _ts = this;
    // 没有纹理材质时抛出错误
    if (!_ts.textures.length) {
      throw new Error('没有可用的textures');
    }
    return _ts.textures.length;
  }

  // 事件
  on(type, fun) {
    const _ts = this;

    switch (type) {
      case 'playing':
      case 'played':
      case 'pause':
      case 'stop':
        _ts.temp.events[type] = fun;
        break;
      default:
        throw new Error('无效的事件');
        break;
    }
  }

  runEvent(type, status) {
    const temp = this.temp;
    if (typeof temp.events[type] === 'function') {
      temp.events[type](status);
    }
  }

  /**
   * 创建精灵
   * @param  {array:string}} imgSrc 图片资源路径
   * @param  {object} resources 已经加载的缓存资源
   * @return {object} 返回精灵
   */
  createSprite(esource, resources) {
    const _ts = this;

    const Sprite = PIXI.Sprite;

    const imgSrc = esource;
    let exeName = getExeName(imgSrc.toLocaleLowerCase());

    // 文件扩展名为 png 则返回对应的名称，其它返回 other
    exeName = exeName === 'png' ? exeName : 'other';

    const funs = {
      png: () => {
        const pngDecodeData = _ts.apngResourceToTextures(resources[imgSrc]);
        _ts.textures = pngDecodeData.textures;
        _ts.framesDelay = pngDecodeData.delayTimes;
        _ts.play();

        // 返回精灵并将纹理材质设置为第一帧图像
        return new Sprite(_ts.textures[0]);
      },
      other: () => {
        _ts.textures = [resources[imgSrc].texture];
        return new Sprite(resources[imgSrc].texture);
      }
    };
    return funs[exeName]();
  }

  /**
   * 将apng缓存资源转换为纹理材质
   * @param  {object} resource    缓存资源
   * @return {object} 返回一个对象，包括apng的每帧时长及解码出来材质
   */
  apngResourceToTextures(resource) {
    const _ts = this;

    const obj = {
      delayTimes: [],
      textures: []
    };
    const buf = new Uint8Array(resource.data);
    const upng = UPNG.decode(buf);
    const rgba = UPNG.toRGBA8(upng);
    const pngWidth = upng.width;
    const pngHeight = upng.height;
    const pngFramesLen = upng.frames.length;

    let spriteSheet;
    let canvas;
    let ctx;
    let imageData;

    // 记录下每帧的时间
    upng.frames.forEach((item, index) => {
      obj.delayTimes.push(item.delay);
    });

    for (let i = 0, len = rgba.length; i < len; i++) {
      const item = rgba[i];
      const data = new Uint8ClampedArray(item);

      if (typeof window !== 'undefined') {
        canvas = document.createElement('canvas');
        canvas.width = pngWidth;
        canvas.height = pngHeight;
        ctx = canvas.getContext('2d');
        spriteSheet = new PIXI.BaseTexture.from(canvas);

        imageData = ctx.createImageData(pngWidth, pngHeight);
        imageData.data.set(data);
        ctx.putImageData(imageData, 0, 0);

        obj.textures.push(new PIXI.Texture(spriteSheet, new PIXI.Rectangle(0, 0, pngWidth, pngHeight)));
      }
    }

    // document.body.appendChild(canvas);
    return obj;
  }
}

export default Image;

export { PIXI };
