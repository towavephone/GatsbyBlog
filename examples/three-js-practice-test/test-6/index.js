import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setClearColor(0xaaaaaa);

  const fov = 75;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 10;
  // 透视相机默认指向 Z 轴负方向，上方向指向 Y 轴正方向
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 6;
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

  function makeSphere(widthDivisions, heightDivisions) {
    const radius = 0.8;
    return new THREE.SphereGeometry(radius, widthDivisions, heightDivisions);
  }

  const highPolySphereGeometry = function() {
    const widthDivisions = 100;
    const heightDivisions = 50;
    return makeSphere(widthDivisions, heightDivisions);
  };

  const lowPolySphereGeometry = function() {
    const widthDivisions = 12;
    const heightDivisions = 9;
    return makeSphere(widthDivisions, heightDivisions);
  };

  function basicLambertPhongExample(MaterialCtor, x = 0, y = 0, lowPoly = true, params = {}) {
    const geometry = lowPoly ? lowPolySphereGeometry() : highPolySphereGeometry();
    const material = new MaterialCtor({
      color: 'hsl(210,50%,50%)',
      ...params
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    mesh.position.x = x;
    mesh.position.y = y;
    return mesh;
  }

  function makeStandardPhysicalMaterialGrid(physical, x = 0, y = 0) {
    const MatCtor = physical ? THREE.MeshPhysicalMaterial : THREE.MeshStandardMaterial;
    const color = physical ? 'hsl(160,50%,50%)' : 'hsl(140,50%,50%)';
    const material = new MatCtor({
      color,
      roughness: 0.1,
      metalness: 0.5
    });
    const mesh = new THREE.Mesh(highPolySphereGeometry(), material);
    scene.add(mesh);
    mesh.position.x = x;
    mesh.position.y = y;
    return mesh;
  }

  function createMeshDepthMaterial(x, y) {
    const radius = 0.2;
    const tube = 0.4;
    const radialSegments = 8;
    const tubularSegments = 64;
    const p = 2;
    const q = 3;
    const geometry = new THREE.TorusKnotGeometry(radius, tube, tubularSegments, radialSegments, p, q);
    const material = new THREE.MeshDepthMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    mesh.position.x = x;
    mesh.position.y = y;
    return mesh;
  }

  function createMeshNormalMaterial(x, y) {
    const radius = 0.2;
    const tube = 0.3;
    const radialSegments = 8;
    const tubularSegments = 64;
    const p = 2;
    const q = 3;
    const geometry = new THREE.TorusKnotGeometry(radius, tube, tubularSegments, radialSegments, p, q);
    const material = new THREE.MeshNormalMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    mesh.position.x = x;
    mesh.position.y = y;
    return mesh;
  }

  function smoothOrFlat(flatShading, x, y, radius = 0.8) {
    const widthDivisions = 12;
    const heightDivisions = 9;
    const geometry = new THREE.SphereGeometry(radius, widthDivisions, heightDivisions);
    const material = new THREE.MeshPhongMaterial({
      flatShading,
      color: 'hsl(300,50%,50%)'
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    mesh.position.x = x;
    mesh.position.y = y;
    return mesh;
  }

  function sideExample(side, x, y) {
    const base = new THREE.Object3D();
    const size = 0.6;
    const geometry = new THREE.PlaneGeometry(size, size);
    [
      { position: [-1, 0, 0], up: [0, 1, 0] },
      { position: [1, 0, 0], up: [0, -1, 0] },
      { position: [0, -1, 0], up: [0, 0, -1] },
      { position: [0, 1, 0], up: [0, 0, 1] },
      { position: [0, 0, -1], up: [1, 0, 0] },
      { position: [0, 0, 1], up: [-1, 0, 0] }
    ].forEach((settings, ndx) => {
      const material = new THREE.MeshBasicMaterial({ side });
      material.color.setHSL(ndx / 6, 0.5, 0.5);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.up.set(...settings.up);
      mesh.lookAt(...settings.position);
      mesh.position.set(...settings.position).multiplyScalar(size * 0.75);
      base.add(mesh);
    });

    scene.add(base);
    base.position.x = x;
    base.position.y = y;
    return base;
  }

  const meshes = [
    // 构建速度从最快到最慢
    basicLambertPhongExample(THREE.MeshBasicMaterial, -4, 1),
    basicLambertPhongExample(THREE.MeshLambertMaterial, -2, 1),
    basicLambertPhongExample(THREE.MeshPhongMaterial, 0, 1),
    makeStandardPhysicalMaterialGrid(false, 2, 1), // MeshStandardMaterial
    makeStandardPhysicalMaterialGrid(true, 4, 1) // MeshPhysicalMaterial
  ];

  // 卡通专用
  basicLambertPhongExample(THREE.MeshToonMaterial, -4, -1);
  // 此处离摄像机很近才能看到深度变化，离摄像机的远近来决定灰度
  createMeshDepthMaterial(-2, -1);
  // 会绘制视图空间法线（相对于摄像机的法线）
  // x 是红色, y 是绿色, 以及 z 是蓝色
  // 所以朝向右边的东西是粉红色，朝向左边的是水蓝色，朝上的是浅绿色，朝下的是紫色，朝向屏幕的是淡紫色
  createMeshNormalMaterial(0, -1);
  // 绘制前面
  sideExample(THREE.FrontSide, 2, -1);
  // 绘制双面
  sideExample(THREE.DoubleSide, 4, -1);

  // 对象是否使用平面着色，默认为 false
  smoothOrFlat(true, -4, -3);
  smoothOrFlat(false, -2, -3);

  function resizeRendererToDisplaySize(renderer, camera) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;

    // 高分辨率处理
    // 也可以用 renderer.setPixelRatio(window.devicePixelRatio) 但不建议，原因如下：
    // 有时需要知道 canvas 绘图缓冲区的确切尺寸，可能尺寸和实际渲染的对不上
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

    meshes.forEach((cube, ndx) => {
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
