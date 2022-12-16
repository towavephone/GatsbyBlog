import * as THREE from 'three';

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({ canvas });

  const left = 0;
  const right = 300; // default canvas size
  const top = 0;
  const bottom = 150; // defautl canvas size
  const near = -1;
  const far = 1;
  const camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
  camera.zoom = 1;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('black');

  const loader = new THREE.TextureLoader();
  const textures = [
    loader.load('/GATSBY_PUBLIC_DIR/images/flower-1.jpg'),
    loader.load('/GATSBY_PUBLIC_DIR/images/flower-2.jpg'),
    loader.load('/GATSBY_PUBLIC_DIR/images/flower-3.jpg'),
    loader.load('/GATSBY_PUBLIC_DIR/images/flower-4.jpg'),
    loader.load('/GATSBY_PUBLIC_DIR/images/flower-5.jpg'),
    loader.load('/GATSBY_PUBLIC_DIR/images/flower-6.jpg')
  ];
  const planeSize = 256;
  const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
  const planes = textures.map((texture) => {
    const planePivot = new THREE.Object3D();
    scene.add(planePivot);
    texture.magFilter = THREE.NearestFilter;
    const planeMat = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    planePivot.add(mesh);
    // move plane so top left corner is origin
    mesh.position.set(planeSize / 2, planeSize / 2, 0);
    return planePivot;
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
    time *= 0.001; // convert to seconds;

    if (resizeRendererToDisplaySize(renderer)) {
      camera.right = canvas.width;
      camera.bottom = canvas.height;
      camera.updateProjectionMatrix();
    }

    const distAcross = Math.max(20, canvas.width - planeSize);
    const distDown = Math.max(20, canvas.height - planeSize);

    // total distance to move across and back
    const xRange = distAcross * 2;
    const yRange = distDown * 2;
    const speed = 180;

    planes.forEach((plane, ndx) => {
      // compute a unique time for each plane
      const t = time * speed + ndx * 300;

      // get a value between 0 and range
      const xt = t % xRange;
      const yt = t % yRange;

      // set our position going forward if 0 to half of range
      // and backward if half of range to range
      const x = xt < distAcross ? xt : xRange - xt;
      const y = yt < distDown ? yt : yRange - yt;

      plane.position.set(x, y, 0);
    });

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
