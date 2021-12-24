var allObjs = [];

const objectsNames = [
  {
    filename: 'rainbow_cube.obj',
    objName: 'player',
    text: '',
  },
  {
    filename: 'cube.obj',
    objName: 'cube',
    text: '',
  }
];

/* Parse *.obj file */
function parseOBJ(text) {
  // because indices are base 1 let's just fill in the 0th data
  const objPositions = [[0, 0, 0]];
  const objTexcoords = [[0, 0]];
  const objNormals = [[0, 0, 0]];

  // same order as `f` indices
  const objVertexData = [
    objPositions,
    objTexcoords,
    objNormals,
  ];

  // same order as `f` indices
  let webglVertexData = [
    [],   // positions
    [],   // texcoords
    [],   // normals
  ];

  var maxY = 0;

  /* Create object from *.obj file */
  function addVertex(vert) {
    const ptn = vert.split('/');
    ptn.forEach((objIndexStr, i) => {
      if (!objIndexStr) {
        return;
      }
      const objIndex = parseInt(objIndexStr);
      const index = objIndex + (objIndex >= 0 ? 0 : objVertexData[i].length);
      webglVertexData[i].push(...objVertexData[i][index]);
    });
  }

  const keywords = {
    v(parts) {
      maxY = (maxY < parts.map(parseFloat)[1]) * parts.map(parseFloat)[1];
      objPositions.push(parts.map(parseFloat));
    },
    vn(parts) {
      objNormals.push(parts.map(parseFloat));
    },
    vt(parts) {
      // should check for missing v and extra w?
      objTexcoords.push(parts.map(parseFloat));
    },
    f(parts) {
      const numTriangles = parts.length - 2;
      for (let tri = 0; tri < numTriangles; ++tri) {
        addVertex(parts[0]);
        addVertex(parts[tri + 1]);
        addVertex(parts[tri + 2]);
      }
    },
  };

  const keywordRE = /(\w*)(?: )*(.*)/;
  const lines = text.split('\n');
  for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
    const line = lines[lineNo].trim();
    if (line === '' || line.startsWith('#')) {
      continue;
    }
    const m = keywordRE.exec(line);
    if (!m) {
      continue;
    }
    const [, keyword, unparsedArgs] = m;
    const parts = line.split(/\s+/).slice(1);
    const handler = keywords[keyword];
    if (!handler) {
      console.warn('unhandled keyword:', keyword);  // eslint-disable-line no-console
      continue;
    }
    handler(parts, unparsedArgs);
  }

  for (var i = 0; i < webglVertexData[0].length; i++) {
    if (i % 3 == 1)
      webglVertexData[0][i] -= maxY / 2.0;
  }

  return {
    position: webglVertexData[0],
    texcoord: webglVertexData[1],
    normal: webglVertexData[2],
  };
}

class Obj {
  constructor(objectProp) {
    if (objectProp == undefined)
      return;
    const data = parseOBJ(objectProp.text);

    this.matrix = mat4.identity(mat4.create());
    this.name = objectProp.objName;
    this.normalMatrix = mat4.toMat3(mat4.identity(mat4.create()));

    /* vertex buffer create */
    this.VertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.position), gl.STATIC_DRAW);
    this.VertexPositionBuffer.itemSize = 3;
    this.VertexPositionBuffer.numItems = data.position.length / 3;

    /* normal buffer create */
    this.NormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.NormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.normal), gl.STATIC_DRAW);

    /* texture coord buffer create */
    this.TextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.TextureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.texcoord), gl.STATIC_DRAW);
    this.texture = loadTexture('cube.png');
  }

  render() {
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, this.matrix);
    gl.uniformMatrix3fv(shaderProgram.normalMatrix, false, this.normalMatrix);

    // vertex
    gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexPositionBuffer);
    gl.vertexAttribPointer(
      shaderProgram.vertexPositionAttribute,
      this.VertexPositionBuffer.itemSize,
      gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    // normals
    gl.bindBuffer(gl.ARRAY_BUFFER, this.NormalBuffer);
    gl.vertexAttribPointer(
      shaderProgram.vertexNormalAttribute,
      3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

    // texture coords
    gl.bindBuffer(gl.ARRAY_BUFFER, this.TextureCoordBuffer);
    gl.vertexAttribPointer(
      shaderProgram.textureCoordAttribute,
      2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.uniform1i(shaderProgram.uSampler, 0);

    gl.drawArrays(gl.TRIANGLES, 0, this.VertexPositionBuffer.numItems);
  }
};

/* Create object from *.obj file */
function createFromOBJ(objectProp) {
  allModels.push(new Obj(objectProp));
}

async function loadAllObjs() {
  for (const object of objectsNames) {
    var response = await fetch(object.filename)
    object.text = await response.text();
  }
}

function pushObjectsInModelArray() {
  objectsNames.forEach(object => {
    createFromOBJ(object);
  });
}