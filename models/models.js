/* All objects that game have array */
var allModels = [];

/* Render all objects */
function renderAllModels() {

  gl.useProgram(shaderProgram);

  allModels.forEach(model => {
    model.render();
  });
}