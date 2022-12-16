import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

// 见左侧效果，这就是一个典型的 z 冲突的例子，GPU 没有足够的精度来决定哪个像素在前哪个在后
// 解决的方法之一是告诉 three.js 使用不同的方法计算像素的前后关系。我们可以在创建 WebGLRenderer 时开启 logarithmicDepthBuffer。
// 如果上面的方案不行的话，那你就遇到了为什么不能无脑使用这种解决方案的情况了。截止 2018 年 9 月，绝大多数台式机可以，但几乎没有移动设备支持这个功能。
// 另外，最好别用这种解决方案，因为这会大大降低运行速度。即便是现在跑得好好地，选择太小的 near 和太大的 far 最终也会遇到同样的问题。
function main() {
  const canvas = document.querySelector('#c1');
  const renderer = new THREE.WebGLRenderer({ canvas });
  const canvas2 = document.querySelector('#c2');
  const renderer2 = new THREE.WebGLRenderer({ canvas: canvas2, logarithmicDepthBuffer: true });

  const fov = 45;
  const aspect = 2; // the canvas default
  const near = 0.00001;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(2, 6, 10);

  class MinMaxGUIHelper {
    constructor(obj, minProp, maxProp, minDif) {
      this.obj = obj;
      this.minProp = minProp;
      this.maxProp = maxProp;
      this.minDif = minDif;
    }

    get min() {
      return this.obj[this.minProp];
    }

    set min(v) {
      this.obj[this.minProp] = v;
      this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
    }

    get max() {
      return this.obj[this.maxProp];
    }

    set max(v) {
      this.obj[this.maxProp] = v;
      this.min = this.min; // this will call the min setter
    }
  }

  function updateCamera() {
    camera.updateProjectionMatrix();
  }

  const gui = new GUI();
  gui.add(camera, 'fov', 1, 180).onChange(updateCamera);
  const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);
  gui
    .add(minMaxGUIHelper, 'min', 0.00001, 50, 0.00001)
    .name('near')
    .onChange(updateCamera);
  gui
    .add(minMaxGUIHelper, 'max', 0.1, 50, 0.1)
    .name('far')
    .onChange(updateCamera);

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 5, 0);
  controls.update();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('black');

  {
    const planeSize = 40;

    const loader = new THREE.TextureLoader();
    const texture = loader.load('/GATSBY_PUBLIC_DIR/images/checker.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    const repeats = planeSize / 2;
    texture.repeat.set(repeats, repeats);

    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -0.5;
    scene.add(mesh);
  }

  {
    const sphereRadius = 3;
    const sphereWidthDivisions = 32;
    const sphereHeightDivisions = 16;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
    const numSpheres = 20;
    for (let i = 0; i < numSpheres; ++i) {
      const sphereMat = new THREE.MeshPhongMaterial();
      sphereMat.color.setHSL(i * 0.73, 1, 0.5);
      const mesh = new THREE.Mesh(sphereGeo, sphereMat);
      mesh.position.set(-sphereRadius - 1, sphereRadius + 2, i * sphereRadius * -2.2);
      scene.add(mesh);
    }
  }

  {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(0, 10, 0);
    light.target.position.set(-5, 0, 0);
    scene.add(light);
    scene.add(light.target);
  }

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

  function render() {
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera);

    if (resizeRendererToDisplaySize(renderer2)) {
      const canvas = renderer2.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    renderer2.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
