/* Create camera */
function createCamera(posX, posY, posZ, angX, angY, angZ) {
  var camera = {};

  var matrix = mat4.create();
  mat4.identity(matrix);
  mat4.perspective(50, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, matrix);
  mat4.rotateX(matrix, angX);
  mat4.rotateY(matrix, angY);
  mat4.rotateZ(matrix, angZ);
  mat4.translate(matrix, [posX, posY, posZ]);

  camera.name = 'camera';
  camera.matrix = matrix;

  camera.render = () => {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, camera.matrix);
  }

  allModels.push(camera);
}