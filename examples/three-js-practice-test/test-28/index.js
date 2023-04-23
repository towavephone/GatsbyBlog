import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({ canvas });

  const fov = 75;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 5;

  const controls = new OrbitControls(camera, canvas);
  controls.update();

  const scene = new THREE.Scene();

  {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  // NOT A GOOD EXAMPLE OF HOW TO MAKE A CUBE!
  // Only trying to make it clear most vertices are unique
  const vertices = [
    // front
    { pos: [-1, -1, 1], norm: [0, 0, 1], uv: [0, 0] },
    { pos: [1, -1, 1], norm: [0, 0, 1], uv: [1, 0] },
    { pos: [-1, 1, 1], norm: [0, 0, 1], uv: [0, 1] },

    { pos: [-1, 1, 1], norm: [0, 0, 1], uv: [0, 1] },
    { pos: [1, -1, 1], norm: [0, 0, 1], uv: [1, 0] },
    { pos: [1, 1, 1], norm: [0, 0, 1], uv: [1, 1] },
    // right
    { pos: [1, -1, 1], norm: [1, 0, 0], uv: [0, 0] },
    { pos: [1, -1, -1], norm: [1, 0, 0], uv: [1, 0] },
    { pos: [1, 1, 1], norm: [1, 0, 0], uv: [0, 1] },

    { pos: [1, 1, 1], norm: [1, 0, 0], uv: [0, 1] },
    { pos: [1, -1, -1], norm: [1, 0, 0], uv: [1, 0] },
    { pos: [1, 1, -1], norm: [1, 0, 0], uv: [1, 1] },
    // back
    { pos: [1, -1, -1], norm: [0, 0, -1], uv: [0, 0] },
    { pos: [-1, -1, -1], norm: [0, 0, -1], uv: [1, 0] },
    { pos: [1, 1, -1], norm: [0, 0, -1], uv: [0, 1] },

    { pos: [1, 1, -1], norm: [0, 0, -1], uv: [0, 1] },
    { pos: [-1, -1, -1], norm: [0, 0, -1], uv: [1, 0] },
    { pos: [-1, 1, -1], norm: [0, 0, -1], uv: [1, 1] },
    // left
    { pos: [-1, -1, -1], norm: [-1, 0, 0], uv: [0, 0] },
    { pos: [-1, -1, 1], norm: [-1, 0, 0], uv: [1, 0] },
    { pos: [-1, 1, -1], norm: [-1, 0, 0], uv: [0, 1] },

    { pos: [-1, 1, -1], norm: [-1, 0, 0], uv: [0, 1] },
    { pos: [-1, -1, 1], norm: [-1, 0, 0], uv: [1, 0] },
    { pos: [-1, 1, 1], norm: [-1, 0, 0], uv: [1, 1] },
    // top
    { pos: [1, 1, -1], norm: [0, 1, 0], uv: [0, 0] },
    { pos: [-1, 1, -1], norm: [0, 1, 0], uv: [1, 0] },
    { pos: [1, 1, 1], norm: [0, 1, 0], uv: [0, 1] },

    { pos: [1, 1, 1], norm: [0, 1, 0], uv: [0, 1] },
    { pos: [-1, 1, -1], norm: [0, 1, 0], uv: [1, 0] },
    { pos: [-1, 1, 1], norm: [0, 1, 0], uv: [1, 1] },
    // bottom
    { pos: [1, -1, 1], norm: [0, -1, 0], uv: [0, 0] },
    { pos: [-1, -1, 1], norm: [0, -1, 0], uv: [1, 0] },
    { pos: [1, -1, -1], norm: [0, -1, 0], uv: [0, 1] },

    { pos: [1, -1, -1], norm: [0, -1, 0], uv: [0, 1] },
    { pos: [-1, -1, 1], norm: [0, -1, 0], uv: [1, 0] },
    { pos: [-1, -1, -1], norm: [0, -1, 0], uv: [1, 1] }
  ];
  const positions = [];
  const normals = [];
  const uvs = [];
  for (const vertex of vertices) {
    positions.push(...vertex.pos);
    normals.push(...vertex.norm);
    uvs.push(...vertex.uv);
  }

  const geometry = new THREE.BufferGeometry();
  const positionNumComponents = 3;
  const normalNumComponents = 3;
  const uvNumComponents = 2;
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents));
  geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents));
  geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), uvNumComponents));

  const loader = new THREE.TextureLoader();
  const texture = loader.load('/GATSBY_PUBLIC_DIR/images/star.png');

  function makeInstance(geometry, color, x) {
    const material = new THREE.MeshPhongMaterial({ color, map: texture });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    cube.position.x = x;
    return cube;
  }

  const cubes = [
    makeInstance(geometry, 0x88ff88, 0),
    makeInstance(geometry, 0x8888ff, -4),
    makeInstance(geometry, 0xff8888, 4)
  ];

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
