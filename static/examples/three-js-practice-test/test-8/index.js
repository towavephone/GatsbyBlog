import * as THREE from 'three';

function createMip(level, numLevels, scale) {
  const u = level / numLevels;
  const size = 2 ** (numLevels - level - 1);
  const halfSize = Math.ceil(size / 2);
  const ctx = document.createElement('canvas').getContext('2d');
  ctx.canvas.width = size * scale;
  ctx.canvas.height = size * scale;
  ctx.scale(scale, scale);
  ctx.fillStyle = `hsl(${(180 + u * 360) | 0}, 100%, 20%)`;
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = `hsl(${(u * 360) | 0}, 100%, 50%)`;
  ctx.fillRect(0, 0, halfSize, halfSize);
  ctx.fillRect(halfSize, halfSize, halfSize, halfSize);
  return ctx.canvas;
}

async function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({ canvas });

  const fov = 60;
  const aspect = 1;
  const near = 0.1;
  const far = 150;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 15;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('black');

  const loader = new THREE.TextureLoader();

  function loadTextureAndPromise(url) {
    let textureResolve;
    const promise = new Promise((resolve) => {
      textureResolve = resolve;
    });
    const texture = loader.load(url, (texture) => {
      textureResolve(texture);
    });
    return {
      texture,
      promise
    };
  }

  const filterTextureInfo = loadTextureAndPromise('/GATSBY_PUBLIC_DIR/images/mip-example.png');
  const filterTexturePromise = filterTextureInfo.promise;

  const texture = await filterTexturePromise;
  const root = new THREE.Object3D();
  const depth = 50;
  const plane = new THREE.PlaneGeometry(1, depth);
  const mipmap = [];
  const numMips = 7;
  for (let i = 0; i < numMips; ++i) {
    mipmap.push(createMip(i, numMips, 1));
  }

  // Is this a design flaw in three.js?
  // AFAIK there's no way to clone a texture really
  // Textures can share an image and I guess deep down
  // if the image is the same they might share a WebGLTexture
  // but no checks for mipmaps I'm guessing. It seems like
  // they shouldn't be checking for same image, the should be
  // checking for same WebGLTexture. Given there is more than
  // WebGL to support maybe they need to abtract WebGLTexture to
  // PlatformTexture or something?

  // minFilter: 当纹理绘制的尺寸小于其原始尺寸时
  // magFilter: 当纹理绘制的尺寸大于其原始尺寸时
  const meshInfos = [
    { x: -1, y: 1, minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter },
    { x: 0, y: 1, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter },
    { x: 1, y: 1, minFilter: THREE.NearestMipmapNearestFilter, magFilter: THREE.LinearFilter },
    { x: -1, y: -1, minFilter: THREE.NearestMipmapLinearFilter, magFilter: THREE.LinearFilter },
    { x: 0, y: -1, minFilter: THREE.LinearMipmapNearestFilter, magFilter: THREE.LinearFilter },
    { x: 1, y: -1, minFilter: THREE.LinearMipmapLinearFilter, magFilter: THREE.LinearFilter }
  ].map((info) => {
    const copyTexture = texture.clone();
    copyTexture.minFilter = info.minFilter;
    copyTexture.magFilter = info.magFilter;
    copyTexture.wrapT = THREE.RepeatWrapping;
    copyTexture.repeat.y = depth;

    const mipTexture = new THREE.CanvasTexture(mipmap[0]);
    // 这里生成的不同颜色的 mipmap 序列有助于明确用了哪个 mip
    // 在左上角和中上角你可以看到第一个 mip 一直用到了远处
    // 右上角和中下角你可以清楚地看到哪里使用了不同的 mip
    mipTexture.mipmaps = mipmap;
    mipTexture.minFilter = info.minFilter;
    mipTexture.magFilter = info.magFilter;
    mipTexture.wrapT = THREE.RepeatWrapping;
    mipTexture.repeat.y = depth;

    const material = new THREE.MeshBasicMaterial({
      map: copyTexture
    });

    const mesh = new THREE.Mesh(plane, material);
    mesh.rotation.x = Math.PI * 0.5 * info.y;
    mesh.position.x = info.x * 1.5;
    mesh.position.y = info.y;
    root.add(mesh);
    return {
      material,
      copyTexture,
      mipTexture
    };
  });
  scene.add(root);

  canvas.addEventListener('click', () => {
    for (const meshInfo of meshInfos) {
      const { material, copyTexture, mipTexture } = meshInfo;
      material.map = material.map === copyTexture ? mipTexture : copyTexture;
    }
  });

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render(time) {
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    camera.position.y = Math.sin(time * 0.2) * 0.5;

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
