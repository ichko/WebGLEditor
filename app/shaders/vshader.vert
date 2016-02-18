precision mediump float;

uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uModelMatrix;

uniform bool uUseAmbient;
uniform vec3 uAmbientColor;

uniform bool uUseDiffuse;
uniform vec3 uDiffuseColor;

uniform vec3 uLightDir;

attribute vec3 aXYZ;
attribute vec3 aColor;
attribute vec3 aNormal;
attribute vec2 aST;

varying vec3 vNormal;
varying vec3 vColor;
varying vec3 vPos;
varying vec2 vST;

void main(){
	vec4 xyzw = vec4(aXYZ,1);
	vec4 xyz  = uModelMatrix * xyzw;
	gl_Position = uProjectionMatrix * uViewMatrix * xyz;

	vST = aST;
	vColor = aColor;
	vPos = xyz.xyz;
	vNormal = aNormal;
}