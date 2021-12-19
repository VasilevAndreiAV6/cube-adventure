/***
 *  Player animation & moving data 
 ***/

/* Pressed keys flags */
var isW = false;
var isS = false;
var isA = false;
var isD = false;
var isPressed = false;

/* Time when moving animation start */
var startTime;

/* Current time */
var currentTime;

/* Animation matricies*/
var startAnimationPlayerPosition = mat4.create();
var midAnimationPlayerPosition = mat4.create();
var endAnimationPlayerPosition = mat4.create();

/* Angle that player rotated */
var playerAngle = 0;

/* Moving animation time (in ms) */
var animationTime = 500;

/* Camera animation & moving data */
var cameraPositionMatrix = mat4.create();
mat4.identity(cameraPositionMatrix);
var startCameraPosition = mat4.create();
var midCameraPosition = mat4.create();
var endCameraPosition = mat4.create();


var gameOver = false;

/* Move player to right cell */
function moveRight() {
  /* Pressed 'D' */
  if (pressedOnce[('D').charCodeAt(0)] && !isPressed) {
    isD = true;
    startTime = (new Date()).getTime();
    Object.assign(startAnimationPlayerPosition, playerPositionMatrix);
    Object.assign(midAnimationPlayerPosition, playerPositionMatrix);
    Object.assign(endAnimationPlayerPosition, playerPositionMatrix);
    Object.assign(startCameraPosition, cameraPositionMatrix);
    Object.assign(endCameraPosition, cameraPositionMatrix);
    Object.assign(midCameraPosition, cameraPositionMatrix);
    mat4.translate(midAnimationPlayerPosition, [1, (Math.sqrt(2) - 1), 0]);
    mat4.translate(endAnimationPlayerPosition, [2, 0, 0]);
    mat4.translate(midCameraPosition, [-0.5, 0, 0]);
    mat4.translate(endCameraPosition, [-1, 0, 0]);
  }
  if (isD) {
    currentTime = (new Date()).getTime();
    if (currentTime - startTime <= animationTime / 2) {
      playerPositionMatrix = matrixLinearInterp(startAnimationPlayerPosition, midAnimationPlayerPosition, (currentTime - startTime) / animationTime * 2);
      cameraPositionMatrix = matrixLinearInterp(startCameraPosition, midCameraPosition, (currentTime - startTime) / animationTime * 2);
      playerRotationMatrix = mat4.rotateZ(mat4.identity(mat4.create()), linearInterp(playerAngle, playerAngle - Math.PI / 4.0, (currentTime - startTime) / animationTime * 2));
    }
    else if (currentTime - startTime <= animationTime + 1) {
      playerPositionMatrix = matrixLinearInterp(midAnimationPlayerPosition, endAnimationPlayerPosition, ((currentTime - startTime) / animationTime - 0.5) * 2);
      playerRotationMatrix = mat4.rotateZ(mat4.identity(mat4.create()), linearInterp(playerAngle - Math.PI / 4.0, playerAngle - Math.PI / 2.0, ((currentTime - startTime) / animationTime - 0.5) * 2));
      cameraPositionMatrix = matrixLinearInterp(midCameraPosition, endCameraPosition, ((currentTime - startTime) / animationTime - 0.5) * 2);
    }
    else {
      isD = false;
      playerAngle -= Math.PI / 2.0;
      playerPos[0]++;
    }
  }
}

/* Move player to right cell */
function moveLeft() {
  /* Pressed 'A' */
  if (pressedOnce[('A').charCodeAt(0)] && !isPressed) {
    isA = true;
    startTime = (new Date()).getTime();
    Object.assign(startAnimationPlayerPosition, playerPositionMatrix);
    Object.assign(midAnimationPlayerPosition, playerPositionMatrix);
    Object.assign(endAnimationPlayerPosition, playerPositionMatrix);
    Object.assign(startCameraPosition, cameraPositionMatrix);
    Object.assign(endCameraPosition, cameraPositionMatrix);
    Object.assign(midCameraPosition, cameraPositionMatrix);
    mat4.translate(midAnimationPlayerPosition, [-1, (Math.sqrt(2) - 1), 0]);
    mat4.translate(endAnimationPlayerPosition, [-2, 0, 0]);
    mat4.translate(midCameraPosition, [0.5, 0, 0]);
    mat4.translate(endCameraPosition, [1, 0, 0]);
  }
  if (isA) {
    currentTime = (new Date()).getTime();
    if (currentTime - startTime <= animationTime / 2) {
      playerPositionMatrix = matrixLinearInterp(startAnimationPlayerPosition, midAnimationPlayerPosition, (currentTime - startTime) / animationTime * 2);
      cameraPositionMatrix = matrixLinearInterp(startCameraPosition, midCameraPosition, (currentTime - startTime) / animationTime * 2);
      playerRotationMatrix = mat4.rotateZ(mat4.identity(mat4.create()), linearInterp(playerAngle, playerAngle + Math.PI / 4.0, (currentTime - startTime) / animationTime * 2));
    }
    else if (currentTime - startTime <= animationTime + 1) {
      playerPositionMatrix = matrixLinearInterp(midAnimationPlayerPosition, endAnimationPlayerPosition, ((currentTime - startTime) / animationTime - 0.5) * 2);
      playerRotationMatrix = mat4.rotateZ(mat4.identity(mat4.create()), linearInterp(playerAngle + Math.PI / 4.0, playerAngle + Math.PI / 2.0, ((currentTime - startTime) / animationTime - 0.5) * 2));
      cameraPositionMatrix = matrixLinearInterp(midCameraPosition, endCameraPosition, ((currentTime - startTime) / animationTime - 0.5) * 2);
    }
    else {
      isA = false;
      playerAngle += Math.PI / 2.0;
      playerPos[0]--;
    }
  }
}

/* Move player to right cell */
function moveForward() {
  /* Pressed 'W' */
  if (pressedOnce[('W').charCodeAt(0)] && !isPressed) {
    isW = true;
    startTime = (new Date()).getTime();
    Object.assign(startAnimationPlayerPosition, playerPositionMatrix);
    Object.assign(midAnimationPlayerPosition, playerPositionMatrix);
    Object.assign(endAnimationPlayerPosition, playerPositionMatrix);
    Object.assign(startCameraPosition, cameraPositionMatrix);
    Object.assign(endCameraPosition, cameraPositionMatrix);
    Object.assign(midCameraPosition, cameraPositionMatrix);
    mat4.translate(midAnimationPlayerPosition, [0, (Math.sqrt(2) - 1), -1]);
    mat4.translate(endAnimationPlayerPosition, [0, 0, -2]);
    mat4.translate(midCameraPosition, [0, 0, 0.5]);
    mat4.translate(endCameraPosition, [0, 0, 1]);
  }
  if (isW) {
    currentTime = (new Date()).getTime();
    if (currentTime - startTime <= animationTime / 2) {
      playerPositionMatrix = matrixLinearInterp(startAnimationPlayerPosition, midAnimationPlayerPosition, (currentTime - startTime) / animationTime * 2);
      cameraPositionMatrix = matrixLinearInterp(startCameraPosition, midCameraPosition, (currentTime - startTime) / animationTime * 2);
      playerRotationMatrix = mat4.rotateX(mat4.identity(mat4.create()), linearInterp(playerAngle, playerAngle - Math.PI / 4.0, (currentTime - startTime) / animationTime * 2));
    }
    else if (currentTime - startTime <= animationTime + 1) {
      playerPositionMatrix = matrixLinearInterp(midAnimationPlayerPosition, endAnimationPlayerPosition, ((currentTime - startTime) / animationTime - 0.5) * 2);
      playerRotationMatrix = mat4.rotateX(mat4.identity(mat4.create()), linearInterp(playerAngle - Math.PI / 4.0, playerAngle - Math.PI / 2.0, ((currentTime - startTime) / animationTime - 0.5) * 2));
      cameraPositionMatrix = matrixLinearInterp(midCameraPosition, endCameraPosition, ((currentTime - startTime) / animationTime - 0.5) * 2);
    }
    else {
      isW = false;
      playerAngle -= Math.PI / 2.0;
      playerPos[2]--;
    }
  }
}

/* Move player to right cell */
function moveBack() {
  /* Pressed 'S' */
  if (pressedOnce[('S').charCodeAt(0)] && !isPressed) {
    isS = true;
    startTime = (new Date()).getTime();
    Object.assign(startAnimationPlayerPosition, playerPositionMatrix);
    Object.assign(midAnimationPlayerPosition, playerPositionMatrix);
    Object.assign(endAnimationPlayerPosition, playerPositionMatrix);
    Object.assign(startCameraPosition, cameraPositionMatrix);
    Object.assign(endCameraPosition, cameraPositionMatrix);
    Object.assign(midCameraPosition, cameraPositionMatrix);
    mat4.translate(midAnimationPlayerPosition, [0, (Math.sqrt(2) - 1), 1]);
    mat4.translate(endAnimationPlayerPosition, [0, 0, 2]);
    mat4.translate(midCameraPosition, [0, 0, -0.5]);
    mat4.translate(endCameraPosition, [0, 0, -1]);
  }
  if (isS) {
    currentTime = (new Date()).getTime();
    if (currentTime - startTime <= animationTime / 2) {
      playerPositionMatrix = matrixLinearInterp(startAnimationPlayerPosition, midAnimationPlayerPosition, (currentTime - startTime) / animationTime * 2);
      cameraPositionMatrix = matrixLinearInterp(startCameraPosition, midCameraPosition, (currentTime - startTime) / animationTime * 2);
      playerRotationMatrix = mat4.rotateX(mat4.identity(mat4.create()), linearInterp(playerAngle, playerAngle + Math.PI / 4.0, (currentTime - startTime) / animationTime * 2));
    }
    else if (currentTime - startTime <= animationTime + 1) {
      playerPositionMatrix = matrixLinearInterp(midAnimationPlayerPosition, endAnimationPlayerPosition, ((currentTime - startTime) / animationTime - 0.5) * 2);
      playerRotationMatrix = mat4.rotateX(mat4.identity(mat4.create()), linearInterp(playerAngle + Math.PI / 4.0, playerAngle + Math.PI / 2.0, ((currentTime - startTime) / animationTime - 0.5) * 2));
      cameraPositionMatrix = matrixLinearInterp(midCameraPosition, endCameraPosition, ((currentTime - startTime) / animationTime - 0.5) * 2);
    }
    else {
      isS = false;
      playerAngle += Math.PI / 2.0;
      playerPos[2]++;
    }
  }
}

function moveFall() {
  gameOver = true;
  mat4.translate(playerPositionMatrix, [0, -0.2, 0]);
}

/* Player moving */
function playerMoving() {
  if (!gameOver) {
    if (curLevel[playerPos[0]][playerPos[1]][playerPos[2] - 1] == ' ') {
      moveForward();
    }
    if (curLevel[playerPos[0]][playerPos[1]][playerPos[2] + 1] == ' ') {
      moveBack();
    }
    if (curLevel[playerPos[0] - 1][playerPos[1]][playerPos[2]] == ' ') {
      moveLeft();
    }
    if (curLevel[playerPos[0] + 1][playerPos[1]][playerPos[2]] == ' ') {
      moveRight();
    }
  }
  if (curLevel[playerPos[0]][playerPos[1] - 1][playerPos[2]] == ' ') {
    moveFall();
  }
  isPressed = isW || isS || isA || isD;
}