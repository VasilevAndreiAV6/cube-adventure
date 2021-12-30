ui_fragment = `
precision mediump float;

uniform sampler2D uSampler;

varying vec3 vPosition;
varying vec2 vTextureCoord;

void main(void)
{
  gl_FragColor = vec4(1.0);
}
`;

ui_vertex = `
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;

varying vec3 vPosition;
varying vec2 vTextureCoord;

void main(void)
{
  gl_Position = uMVMatrix * vec4(aVertexPosition, 1.0);
  vPosition = aVertexPosition;
  vTextureCoord = aTextureCoord;
}
`;