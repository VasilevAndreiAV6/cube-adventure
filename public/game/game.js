/* Camera matrix */
var pMatrix = mat4.create();
mat4.identity(pMatrix);

/* Matrix of current player position */
var playerPositionMatrix = mat4.create();
mat4.identity(playerPositionMatrix);

/* Matrix of current player rotation */
var playerRotationMatrix = mat4.create();
mat4.identity(playerRotationMatrix);

/* Player start position matrix */
var playerStartMatrix = mat4.create();
mat4.identity(playerStartMatrix);

/* Player position vector */
var playerPos = [0, 0, 0];

/* Level array */
var curLevel = [];
curLevel[0] = [];
curLevel[0][0] = [];
curLevel[0][0][0] = '';

/* Pressed keys data */
var pressed = {};
var pressedOnce = {};

/***
 * Keyboard event listeners
 ***/
document.addEventListener('keydown', function (e) {
  e = e || window.event;
  if (pressed[e.keyCode] != true)
    pressedOnce[e.keyCode] = true;
  pressed[e.keyCode] = true;
  //iPressed = true;
});

document.addEventListener('keyup', function (e) {
  e = e || window.event;
  delete pressed[e.keyCode];
});

/* Load level from text */
function loadLevel(level) {
  var w = 0, h = 0, d = 0;

  for (var i = 0; level.layers.charAt(i) != '/'; i++) {
    /* Block */
    if (level.layers.charAt(i) === '*') {
      var cube = new Obj();
      Object.assign(cube, allModels.find(obj => obj.name === 'cube'));

      cube.matrix = mat4.identity(mat4.create());
      mat4.translate(cube.matrix, [w - level.w / 2.0, h - level.h / 2.0 - 0.5, d - level.d / 2.0]);
      mat4.scale(cube.matrix, [1 / 1.6, 1 / 1.6, 1 / 1.6]);
      cube.name = 'field';
      allModels.push(cube);

      if (curLevel[w] == undefined)
        curLevel.push([]);
      if (curLevel[w][h] == undefined)
        curLevel[w].push([]);
      if (curLevel[w][h][d] == undefined)
        curLevel[w][h].push(['']);
      curLevel[w][h][d] = '*';
    }
    /* Void */
    else if (level.layers.charAt(i) === '.') {
      if (curLevel[w] == undefined)
        curLevel.push([]);
      if (curLevel[w][h] == undefined)
        curLevel[w].push([]);
      if (curLevel[w][h][d] == undefined)
        curLevel[w][h].push(['']);
      curLevel[w][h][d] = ' ';
    }
    /* Player */
    else if (level.layers.charAt(i) === 'P') {
      var matrix = mat4.create();
      mat4.identity(matrix);
      mat4.translate(matrix, [0, -0.5, 0]);
      mat4.translate(matrix, [w - level.w / 2.0, h - level.h / 2.0 + 0.5, d - level.d / 2.0]);
      allModels.find(obj => obj.name === 'player').matrix = matrix;

      Object.assign(playerStartMatrix, matrix);
      if (curLevel[w] == undefined)
        curLevel.push([]);
      if (curLevel[w][h] == undefined)
        curLevel[w].push([]);
      if (curLevel[w][h][d] == undefined)
        curLevel[w][h].push(['']);
      curLevel[w][h][d] = ' ';
      playerPos[0] = w;
      playerPos[1] = h;
      playerPos[2] = d;

      mat4.translate(pMatrix, [-w, -h, -d]);
    }
    else
      continue;

    if (h < level.h && w == level.w - 1 && d == level.d - 1)
      h++, d = 0, w = 0;
    else if (d < level.d && w == level.w - 1)
      d++, w = 0;
    else if (w < level.w)
      w++;


  }

}

/* Game initialization */
function initGame() {
  var level = {};
  level.w = 14;
  level.h = 2;
  level.d = 12;
  level.layers =
    `
    ..............
    .************.
    .************.
    .************.
    .************.
    .************.
    .************.
    .************.
    .************.
    .************.
    .************.
    ..............

    ..............
    ....******....
    ..............
    .......P......
    ..............
    ..............
    ..............
    ..............
    ..............
    ......*.......
    ..............
    ..............
    /`;

  createCamera(
    0, -6, 0,
    0.6, -0.6, 0);
  Object.assign(pMatrix, allModels.find(obj => obj.name === 'camera').matrix);

  loadLevel(level);

  for (var i = 0; i < allModels.length; i++) {
    if (allModels[i].name === 'cube') {
      allModels.splice(i, 1);
    }
  }
}

/* Linear interpolation for 1f value */
function linearInterp(a, b, t) {
  //t = Math.sin(t * Math.PI / 2.0);// * 0.5 + 0.5;
  return a * (1 - t) + b * t
}

/* Linear interpolation for 4x4 matrix */
function matrixLinearInterp(a, b, t) {
  var c = mat4.create();
  //t = Math.sin(t * Math.PI / 2.0);// * 0.5 + 0.5;
  var minust = 1 - t;
  c[0] = a[0] * minust + b[0] * t;
  c[1] = a[1] * minust + b[1] * t;
  c[2] = a[2] * minust + b[2] * t;
  c[3] = a[3] * minust + b[3] * t;
  c[4] = a[4] * minust + b[4] * t;
  c[5] = a[5] * minust + b[5] * t;
  c[6] = a[6] * minust + b[6] * t;
  c[7] = a[7] * minust + b[7] * t;
  c[8] = a[8] * minust + b[8] * t;
  c[9] = a[9] * minust + b[9] * t;
  c[10] = a[10] * minust + b[10] * t;
  c[11] = a[11] * minust + b[11] * t;
  c[12] = a[12] * minust + b[12] * t;
  c[13] = a[13] * minust + b[13] * t;
  c[14] = a[14] * minust + b[14] * t;
  c[15] = a[15] * minust + b[15] * t;
  return c;
}

/* Main response game function */
function responseGame() {
  playerMoving();
  //mat4.multiply(mat4.multiply(mat4.identity(mat4.create()), playerStartMatrix, mat4.create()), playerRotationMatrix, allModels.find(obj => obj.name === 'player').matrix);
  mat4.multiply(mat4.multiply(playerPositionMatrix, playerStartMatrix, mat4.create()), playerRotationMatrix, allModels.find(obj => obj.name === 'player').matrix);
  mat4.multiply(pMatrix, cameraPositionMatrix, allModels.find(obj => obj.name === 'camera').matrix);
  mat4.toMat3(playerRotationMatrix, allModels.find(obj => obj.name === 'player').normalMatrix);
  for (var key in pressedOnce)
    delete pressedOnce[key];
}
