// WebGL - Triangle with position for color
// from https://webglfundamentals.org/webgl/webgl-2d-triangle-with-position-for-color.html
function main() {
  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  var canvas = document.querySelector('#canvas');
  var gl = canvas.getContext('webgl');
  if (!gl) {
    return;
  }

  // setup GLSL program
  var program = window.webglUtils.createProgramFromScripts(gl, ['vertex-shader-2d', 'fragment-shader-2d']);

  // look up where the vertex data needs to go.
  var positionAttributeLocation = gl.getAttribLocation(program, 'a_position');

  // lookup uniforms
  var matrixLocation = gl.getUniformLocation(program, 'u_matrix');

  // Create a buffer.
  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Set Geometry.
  setGeometry(gl);

  var translation = [200, 150];
  var angleInRadians = 0;
  var scale = [1, 1];

  drawScene();

  // Setup a ui.
  window.webglLessonsUI.setupSlider('#x', { value: translation[0], slide: updatePosition(0), max: gl.canvas.width });
  window.webglLessonsUI.setupSlider('#y', { value: translation[1], slide: updatePosition(1), max: gl.canvas.height });
  window.webglLessonsUI.setupSlider('#angle', { slide: updateAngle, max: 360 });
  window.webglLessonsUI.setupSlider('#scaleX', {
    value: scale[0],
    slide: updateScale(0),
    min: -5,
    max: 5,
    step: 0.01,
    precision: 2
  });
  window.webglLessonsUI.setupSlider('#scaleY', {
    value: scale[1],
    slide: updateScale(1),
    min: -5,
    max: 5,
    step: 0.01,
    precision: 2
  });

  function updatePosition(index) {
    return function(event, ui) {
      translation[index] = ui.value;
      drawScene();
    };
  }

  function updateAngle(event, ui) {
    var angleInDegrees = 360 - ui.value;
    angleInRadians = (angleInDegrees * Math.PI) / 180;
    drawScene();
  }

  function updateScale(index) {
    return function(event, ui) {
      scale[index] = ui.value;
      drawScene();
    };
  }

  // Draw the scene.
  function drawScene() {
    window.webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas.
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // Turn on the attribute
    gl.enableVertexAttribArray(positionAttributeLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2; // 2 components per iteration
    var type = gl.FLOAT; // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

    // Compute the matrix
    var matrix = window.m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
    matrix = window.m3.translate(matrix, translation[0], translation[1]);
    matrix = window.m3.rotate(matrix, angleInRadians);
    matrix = window.m3.scale(matrix, scale[0], scale[1]);

    // Set the matrix.
    gl.uniformMatrix3fv(matrixLocation, false, matrix);

    // Draw the geometry.
    var primitiveType = gl.TRIANGLES;
    gl.drawArrays(primitiveType, 0, 3);
  }
}

// Fill the buffer with the values that define a triangle.
// Note, will put the values in whatever buffer is currently
// bound to the ARRAY_BUFFER bind point
function setGeometry(gl) {
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, -100, 150, 125, -175, 100]), gl.STATIC_DRAW);
}

main();
