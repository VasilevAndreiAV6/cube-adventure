var shaders = [
  /*{
    name: 'default',
    vertex: default_vertex,
    fragment: default_fragment,
  },*/
  {
    name: 'ui',
    vertex: ui_vertex,
    fragment: ui_fragment,
  },
];

// All shader programs
shaderPrograms = [];

// Default shader program
shaderProgram = 0;

// UI shader program
shaderUIProgram = 0;

function getShader(shaderData, name) {
  var shader;

  if (name == 'fragment' && shaderData.fragment != undefined) {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
    str = shaderData.fragment;
  } else if (name == 'vertex' && shaderData.vertex != undefined) {
    shader = gl.createShader(gl.VERTEX_SHADER);
    str = shaderData.vertex;
  } else if (name === 'geometry' && shaderData.geometry != undefined) {
    shader = gl.createShader(gl.GEOMETRY_SHADER);
    str = shaderData.geomerty;
  }
  else {
    return null;
  }

  gl.shaderSource(shader, str);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('\'' + shaderData.name + '\' shader error');
    alert(gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}

/* Shaders initialization function */
function initShaders() {

  shaders.forEach((shader, i) => {
    var fragmentShader = getShader(shader, 'fragment');
    var geometryShader = getShader(shader, 'geometry');
    var vertexShader = getShader(shader, 'vertex');

    shaderPrograms.push(gl.createProgram());

    if (vertexShader != null) {
      gl.attachShader(shaderPrograms[i], vertexShader);
    }
    else {
      console.log('vertex shader loading error');
    }
    if (geometryShader != null) {
      gl.attachShader(shaderPrograms[i], geometryShader);
    }
    if (fragmentShader != null) {
      gl.attachShader(shaderPrograms[i], fragmentShader);
    }
    else {
      console.log('fragment shader loading error');
    }
    gl.linkProgram(shaderPrograms[i]);

    if (!gl.getProgramParameter(shaderPrograms[i], gl.LINK_STATUS)) {
      alert("Could not initialise shaders");
    }
  });
  //shaderProgram = shaderPrograms[0];
  shaderUIProgram = shaderPrograms[0];

  /* Default shader uniforms and attribs * /
  gl.useProgram(shaderProgram);

  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
  shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
  gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
  shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
  gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

  shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
  shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
  shaderProgram.uSampler = gl.getUniformLocation(shaderProgram, "uSampler");
  shaderProgram.normalMatrix = gl.getUniformLocation(shaderProgram, "normalMatrix");

  /* UI shader uniforms and attribs */
  gl.useProgram(shaderUIProgram);

  shaderUIProgram.vertexPositionAttribute = gl.getAttribLocation(shaderUIProgram, "aVertexPosition");
  gl.enableVertexAttribArray(shaderUIProgram.vertexPositionAttribute);
  shaderUIProgram.textureCoordAttribute = gl.getAttribLocation(shaderUIProgram, "aTextureCoord");
  gl.enableVertexAttribArray(shaderUIProgram.textureCoordAttribute);

  shaderUIProgram.mvMatrixUniform = gl.getUniformLocation(shaderUIProgram, "uMVMatrix");
  shaderUIProgram.uSampler = gl.getUniformLocation(shaderUIProgram, "uSampler");
}