var uiObjects = [];

function renderUI() {
  gl.useProgram(shaderUIProgram);
  uiObjects.forEach(obj => obj.render())
}

function createPlane() {
  var plane = {};
  var vertices = [
    -1.0, -1.0, 0,
    -1.0, 1.0, 0,
    1.0, 1.0, 0,

    1.0, 1.0, 0,
    -1.0, -1.0, 0,
    1.0, -1.0, 0,
  ];

  var textureCoordinates = [
    -1.0, -1.0,
    -1.0, 1.0,
    1.0, -1.0,
    1.0, 1.0,
  ];


  plane.matrix = mat4.translate(mat4.identity(mat4.create()), [0, 0, 0]);
  mat4.ortho(plane.matrix, -1.0, 1.0, -1.0, 1.0, 0.1, 100);
  plane.name = 'plane';

  /* vertex buffer create */
  plane.VertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, plane.VertexPositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  plane.VertexPositionBuffer.itemSize = 3;
  plane.VertexPositionBuffer.numItems = 6;

  /* texture coord buffer create */
  plane.TextureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, plane.TextureCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

  plane.render = () => {
    var a = mat4.identity(mat4.create());
    mat4.scale(a, [100, 100, 100]);
    gl.uniformMatrix4fv(shaderUIProgram.mvMatrixUniform, false, mat4.multiply(a, pMatrix, a));

    // vertex
    gl.bindBuffer(gl.ARRAY_BUFFER, plane.VertexPositionBuffer);
    gl.vertexAttribPointer(
      shaderUIProgram.vertexPositionAttribute,
      plane.VertexPositionBuffer.itemSize,
      gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shaderUIProgram.vertexPositionAttribute);

    // texture coords
    /*gl.bindBuffer(gl.ARRAY_BUFFER, plane.TextureCoordBuffer);
    gl.vertexAttribPointer(
      shaderUIProgram.textureCoordAttribute,
      2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shaderUIProgram.textureCoordAttribute);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, plane.texture);
    gl.uniform1i(shaderUIProgram.uSampler, 0);*/

    gl.drawArrays(gl.TRIANGLES, 0, plane.VertexPositionBuffer.numItems);
  }

  uiObjects.push(plane);
}