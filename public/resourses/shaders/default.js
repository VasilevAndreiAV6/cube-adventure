default_fragment = `
precision mediump float;

uniform sampler2D uSampler;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vTextureCoord;

vec3 Shade( vec3 P, vec3 N, vec3 L, vec3 LColor )
{
  vec3 V = normalize(P);
  vec3 color = vec3(0);
  vec3 Ka = vec3(0);
  vec3 Kd = vec3(1);
  vec3 Ks = vec3(0);
  // Reverse normal if need
  //N = faceforward(N, V, N);

  // Ambient
  color += Ka;

  // Duffuse
  float nl = dot(N, L);
  nl = max(nl, 0.0);
  vec3 diff = LColor * (Kd) * nl;
  //if (IsTexture0)
    diff *= texture2D(uSampler, vTextureCoord).rgb;
  color += diff;
  
  return color;
}

void main(void)
{
  vec3 color = vec3(0.5);//texture2D(uSampler, vTextureCoord).xyz;
  float light = dot(normalize(vNormal), normalize(vec3(0.8, 1, 0.3)));

  color = max(color / 5.0, color * light);
  gl_FragColor = vec4(color, 1);
  
  gl_FragColor = vec4(Shade(vPosition, vNormal, normalize(vec3(0.8, 1, 0.7)), vec3(1)), 1);
}
`;

default_vertex = `
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat3 normalMatrix;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vTextureCoord;

void main(void)
{
  gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
  vNormal = normalize(normalMatrix * aVertexNormal);
  vPosition = aVertexPosition;
  vTextureCoord = aTextureCoord;
}
`;