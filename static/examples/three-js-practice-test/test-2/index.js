import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({ canvas });

  const fov = 75;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 5;
  // 透视相机默认指向 Z 轴负方向，上方向指向 Y 轴正方向
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 2;
  // 不能看到相机本身
  // const cameraHelper = new THREE.CameraHelper(camera);

  const scene = new THREE.Scene();
  // scene.add(cameraHelper);

  {
    const controls = new OrbitControls(camera, canvas);
    controls.update();
  }

  {
    const color = 0xffffff;
    const intensity = 1;
    // 平行光，默认有一个位置和目标点。默认值都为 (0, 0, 0)
    const light = new THREE.DirectionalLight(color, intensity);
    // 位于摄像机左上方，鼠标滚动可看到
    light.position.set(-1, 2, 4);
    const helper = new THREE.DirectionalLightHelper(light);
    scene.add(helper);
    scene.add(light);
  }

  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  function makeInstance(geometry, color, x) {
    const material = new THREE.MeshPhongMaterial({ color });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    cube.position.x = x;

    return cube;
  }

  const cubes = [
    makeInstance(geometry, 0x44aa88, 0),
    makeInstance(geometry, 0x8844aa, -2),
    makeInstance(geometry, 0xaa8844, 2)
  ];

  function resizeRendererToDisplaySize(renderer, camera) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;

    // 高分辨率处理
    const width = canvas.clientWidth * pixelRatio || 0;
    const height = canvas.clientHeight * pixelRatio || 0;
    // clientWidth 代表拉伸后的宽度（即真实宽度），width 代表拉伸前的宽度
    const needResize = canvas.width !== width || canvas.height !== height;
    if (!needResize) {
      return;
    }

    // 避免拉伸
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();

    // 设置渲染大小和实际大小一致
    // 第三个参数 false 代表不设置 canvas 的 css 尺寸
    renderer.setSize(width, height, false);
  }

  function render(time) {
    time *= 0.001; // convert time to seconds

    resizeRendererToDisplaySize(renderer, camera);

    cubes.forEach((cube, ndx) => {
      const speed = 1 + ndx * 0.1;
      const rot = time * speed;
      cube.rotation.x = rot;
      cube.rotation.y = rot;
    });

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

main();
