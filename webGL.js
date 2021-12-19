function initGL(canvas) {
  try {
    gl = canvas.getContext("experimental-webgl");
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
  } catch (e) {
  }
  if (!gl) {
    alert("Could not initialise WebGL");
  }
}

/* Draw scene function */
function drawScene() {
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  responseGame();
  renderAllModels();
}

/* Tick function */
function tick() {
  window.requestAnimationFrame(tick);
  drawScene();
}

/* WEbGL start function */
function webGLStart() {
  var canvas = document.getElementById("wegl-canvas");
  initGL(canvas);
  initShaders();
  loadAllObjs().then(function () {
    pushObjectsInModelArray();
    initGame();

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    drawScene();
    tick();
  });
}
