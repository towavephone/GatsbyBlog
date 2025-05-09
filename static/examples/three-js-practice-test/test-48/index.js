import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

  const fov = 60;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 10;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 2.5;

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 1.2;
  controls.maxDistance = 4;
  controls.update();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#246');

  const pickingScene = new THREE.Scene();
  pickingScene.background = new THREE.Color(0);

  const tempColor = new THREE.Color();
  function get255BasedColor(color) {
    tempColor.set(color);
    const base = tempColor.toArray().map((v) => v * 255);
    base.push(255); // alpha
    return base;
  }

  const maxNumCountries = 512;
  const paletteTextureWidth = maxNumCountries;
  const paletteTextureHeight = 1;
  const palette = new Uint8Array(paletteTextureWidth * 4);
  const paletteTexture = new THREE.DataTexture(palette, paletteTextureWidth, paletteTextureHeight);
  paletteTexture.minFilter = THREE.NearestFilter;
  paletteTexture.magFilter = THREE.NearestFilter;

  const selectedColor = get255BasedColor('red');
  const unselectedColor = get255BasedColor('#444');
  const oceanColor = get255BasedColor('rgb(100,200,255)');
  resetPalette();

  function setPaletteColor(index, color) {
    palette.set(color, index * 4);
  }

  function resetPalette() {
    // make all colors the unselected color
    for (let i = 1; i < maxNumCountries; ++i) {
      setPaletteColor(i, unselectedColor);
    }

    // set the ocean color (index #0)
    setPaletteColor(0, oceanColor);
    paletteTexture.needsUpdate = true;
  }

  {
    const loader = new THREE.TextureLoader();
    const geometry = new THREE.SphereGeometry(1, 64, 32);

    const indexTexture = loader.load('/GATSBY_PUBLIC_DIR/images/country-index-texture.png', render);
    indexTexture.minFilter = THREE.NearestFilter;
    indexTexture.magFilter = THREE.NearestFilter;

    const pickingMaterial = new THREE.MeshBasicMaterial({ map: indexTexture });
    pickingScene.add(new THREE.Mesh(geometry, pickingMaterial));

    // 以下的片段着色器必须使用 threejs 的 146 版本，否则编译报错
    const fragmentShaderReplacements = [
      {
        from: '#include <common>',
        to: `
          #include <common>
          uniform sampler2D indexTexture;
          uniform sampler2D paletteTexture;
          uniform float paletteTextureWidth;
        `
      },
      {
        from: '#include <color_fragment>',
        to: `
          #include <color_fragment>
          {
            vec4 indexColor = texture2D(indexTexture, vUv);
            float index = indexColor.r * 255.0 + indexColor.g * 255.0 * 256.0;
            vec2 paletteUV = vec2((index + 0.5) / paletteTextureWidth, 0.5);
            vec4 paletteColor = texture2D(paletteTexture, paletteUV);
            // diffuseColor.rgb += paletteColor.rgb;   // white outlines
            diffuseColor.rgb = paletteColor.rgb - diffuseColor.rgb;  // black outlines
          }
        `
      }
    ];

    const texture = loader.load('/GATSBY_PUBLIC_DIR/images/country-outlines-4k.png', render);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    material.onBeforeCompile = function(shader) {
      fragmentShaderReplacements.forEach((rep) => {
        shader.fragmentShader = shader.fragmentShader.replace(rep.from, rep.to);
      });
      shader.uniforms.paletteTexture = { value: paletteTexture };
      shader.uniforms.indexTexture = { value: indexTexture };
      shader.uniforms.paletteTextureWidth = { value: paletteTextureWidth };
    };
    scene.add(new THREE.Mesh(geometry, material));
  }

  async function loadJSON(url) {
    const req = await fetch(url);
    return req.json();
  }

  let numCountriesSelected = 0;
  let countryInfos;
  async function loadCountryData() {
    countryInfos = await loadJSON('./data/country-info.json');  /* threejs.org: url */

    const lonFudge = Math.PI * 1.5;
    const latFudge = Math.PI;
    // these helpers will make it easy to position the boxes
    // We can rotate the lon helper on its Y axis to the longitude
    const lonHelper = new THREE.Object3D();
    // We rotate the latHelper on its X axis to the latitude
    const latHelper = new THREE.Object3D();
    lonHelper.add(latHelper);
    // The position helper moves the object to the edge of the sphere
    const positionHelper = new THREE.Object3D();
    positionHelper.position.z = 1;
    latHelper.add(positionHelper);

    const labelParentElem = document.querySelector('#labels');
    for (const countryInfo of countryInfos) {
      const {lat, lon, min, max, name} = countryInfo;

      // adjust the helpers to point to the latitude and longitude
      lonHelper.rotation.y = THREE.MathUtils.degToRad(lon) + lonFudge;
      latHelper.rotation.x = THREE.MathUtils.degToRad(lat) + latFudge;

      // get the position of the lat/lon
      positionHelper.updateWorldMatrix(true, false);
      const position = new THREE.Vector3();
      positionHelper.getWorldPosition(position);
      countryInfo.position = position;

      // compute the area for each country
      const width = max[0] - min[0];
      const height = max[1] - min[1];
      const area = width * height;
      countryInfo.area = area;

      // add an element for each country
      const elem = document.createElement('div');
      elem.textContent = name;
      labelParentElem.appendChild(elem);
      countryInfo.elem = elem;
    }
    requestRenderIfNotRequested();
  }

  loadCountryData();

  const tempV = new THREE.Vector3();
  const cameraToPoint = new THREE.Vector3();
  const cameraPosition = new THREE.Vector3();
  const normalMatrix = new THREE.Matrix3();

  const settings = {
    minArea: 20,
    maxVisibleDot: -0.2
  };

  function updateLabels() {
    // exit if we have not loaded the data yet
    if (!countryInfos) {
      return;
    }

    const large = settings.minArea * settings.minArea;
    // get a matrix that represents a relative orientation of the camera
    normalMatrix.getNormalMatrix(camera.matrixWorldInverse);
    // get the camera's position
    camera.getWorldPosition(cameraPosition);
    for (const countryInfo of countryInfos) {
      const { position, elem, area, selected } = countryInfo;
      const largeEnough = area >= large;
      const show = selected || (numCountriesSelected === 0 && largeEnough);
      if (!show) {
        elem.style.display = 'none';
        continue;
      }

      // Orient the position based on the camera's orientation.
      // Since the sphere is at the origin and the sphere is a unit sphere
      // this gives us a camera relative direction vector for the position.
      tempV.copy(position);
      tempV.applyMatrix3(normalMatrix);

      // compute the direction to this position from the camera
      cameraToPoint.copy(position);
      cameraToPoint.applyMatrix4(camera.matrixWorldInverse).normalize();

      // get the dot product of camera relative direction to this position
      // on the globe with the direction from the camera to that point.
      // -1 = facing directly towards the camera
      // 0 = exactly on tangent of the sphere from the camera
      // > 0 = facing away
      const dot = tempV.dot(cameraToPoint);

      // if the orientation is not facing us hide it.
      if (dot > settings.maxVisibleDot) {
        elem.style.display = 'none';
        continue;
      }

      // restore the element to its default display style
      elem.style.display = '';

      // get the normalized screen coordinate of that position
      // x and y will be in the -1 to +1 range with x = -1 being
      // on the left and y = -1 being on the bottom
      tempV.copy(position);
      tempV.project(camera);

      // convert the normalized position to CSS coordinates
      const x = (tempV.x * 0.5 + 0.5) * canvas.clientWidth;
      const y = (tempV.y * -0.5 + 0.5) * canvas.clientHeight;

      // move the elem to that position
      elem.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;

      // set the zIndex for sorting
      elem.style.zIndex = ((-tempV.z * 0.5 + 0.5) * 100000) | 0;
    }
  }

  class GPUPickHelper {
    constructor() {
      // create a 1x1 pixel render target
      this.pickingTexture = new THREE.WebGLRenderTarget(1, 1);
      this.pixelBuffer = new Uint8Array(4);
    }

    pick(cssPosition, scene, camera) {
      const { pickingTexture, pixelBuffer } = this;

      // set the view offset to represent just a single pixel under the mouse
      const pixelRatio = renderer.getPixelRatio();
      camera.setViewOffset(
        renderer.getContext().drawingBufferWidth, // full width
        renderer.getContext().drawingBufferHeight, // full top
        (cssPosition.x * pixelRatio) | 0, // rect x
        (cssPosition.y * pixelRatio) | 0, // rect y
        1, // rect width
        1 // rect height
      );
      // render the scene
      renderer.setRenderTarget(pickingTexture);
      renderer.render(scene, camera);
      renderer.setRenderTarget(null);
      // clear the view offset so rendering returns to normal
      camera.clearViewOffset();
      //read the pixel
      renderer.readRenderTargetPixels(
        pickingTexture,
        0, // x
        0, // y
        1, // width
        1, // height
        pixelBuffer
      );

      const id = (pixelBuffer[0] << 0) | (pixelBuffer[1] << 8) | (pixelBuffer[2] << 16);

      return id;
    }
  }

  const pickHelper = new GPUPickHelper();

  const maxClickTimeMs = 200;
  const maxMoveDeltaSq = 5 * 5;
  const startPosition = {};
  let startTimeMs;

  function getCanvasRelativePosition(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) * canvas.width) / rect.width,
      y: ((event.clientY - rect.top) * canvas.height) / rect.height
    };
  }

  function recordStartTimeAndPosition(event) {
    startTimeMs = performance.now();
    const pos = getCanvasRelativePosition(event);
    startPosition.x = pos.x;
    startPosition.y = pos.y;
  }

  function pickCountry(event) {
    // exit if we have not loaded the data yet
    if (!countryInfos) {
      return;
    }

    // if it's been a moment since the user started
    // then assume it was a drag action, not a select action
    const clickTimeMs = performance.now() - startTimeMs;
    if (clickTimeMs > maxClickTimeMs) {
      return;
    }

    // if they moved assume it was a drag action
    const position = getCanvasRelativePosition(event);
    const moveDeltaSq = Math.pow(startPosition.x - position.x, 2) + Math.pow(startPosition.y - position.y, 2);
    if (moveDeltaSq > maxMoveDeltaSq) {
      return;
    }

    const id = pickHelper.pick(position, pickingScene, camera);
    if (id > 0) {
      const countryInfo = countryInfos[id - 1];
      const selected = !countryInfo.selected;
      if (selected && !event.shiftKey && !event.ctrlKey && !event.metaKey) {
        unselectAllCountries();
      }
      numCountriesSelected += selected ? 1 : -1;
      countryInfo.selected = selected;
      setPaletteColor(id, selected ? selectedColor : unselectedColor);
      paletteTexture.needsUpdate = true;
    } else if (numCountriesSelected) {
      unselectAllCountries();
    }
    requestRenderIfNotRequested();
  }

  function unselectAllCountries() {
    numCountriesSelected = 0;
    countryInfos.forEach((countryInfo) => {
      countryInfo.selected = false;
    });
    resetPalette();
  }

  canvas.addEventListener('pointerdown', recordStartTimeAndPosition);
  canvas.addEventListener('pointerup', pickCountry);

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

  let renderRequested = false;

  function render() {
    renderRequested = undefined;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    controls.update();

    updateLabels();

    renderer.render(scene, camera);
  }
  render();

  function requestRenderIfNotRequested() {
    if (!renderRequested) {
      renderRequested = true;
      requestAnimationFrame(render);
    }
  }

  controls.addEventListener('change', requestRenderIfNotRequested);
  window.addEventListener('resize', requestRenderIfNotRequested);
}

main();
