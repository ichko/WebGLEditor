precision mediump float;

uniform vec3 uLightDir;
uniform bool uUseSpecular;
uniform vec3 uSpecularColor;
uniform mat4 uViewMatrix;
uniform mat4 uNormalMatrix;
uniform mat4 uModelMatrix;
uniform bool useTexture;
uniform bool useNormalTexture;
uniform vec3 viewDirection;
uniform vec3 cameraPoz;

varying vec3 vNormal;
varying vec3 vColor;
varying vec3 vPos;

uniform float uTexScale;
uniform sampler2D uTxtSampler;
uniform sampler2D uNormSampler;
varying vec2 vST;
varying vec3 diffuse;

// FOG
uniform bool useFog;
uniform vec4 fogColor;
uniform float minDistance;
uniform float maxDistance;


void main(){
	mat4 mvMatrix = uViewMatrix * uModelMatrix;
	vec3 ldir = (vec4(1,1,1,0)).xyz;
	vec3 light = normalize(ldir);
	vec3 vNorm = vNormal;

	vec3 normalMap = vec3(1,1,1);
	if(useNormalTexture)
		vNorm *= normalize(texture2D(uNormSampler, vST).xyz * 2. - 1.);

	vec3 normal = vec3(normalize(uNormalMatrix * vec4(vNorm, 0.)));

	vec3 reflectedLight = normalize(reflect(light, normalize(vNorm)));

	// в локалната координатна система "окото" на гледащия е в (0,0,0),
	// а векторът от точката до "окото" е pos-(0,0,0) = pos
	vec3 viewDir = normalize(viewDirection);

	vec4 texCol = texture2D(uTxtSampler, vST);

	// готови сме да сметнем лъскавината
	float cosa = max(dot(reflectedLight,viewDir), 0.0);
	vec3 specularColor = vec3(pow(cosa,10.))*0.5;
	vec3 diffuseColor = vColor*max(dot(normal, light), -0.5);
	vec3 color = vColor + specularColor + diffuseColor;

	if(useTexture)
		color *= texCol.stp;

	if(useFog){
		float len = distance(vPos, cameraPoz);
		float dDist = maxDistance - minDistance;
		
		if(len > minDistance)
			color = mix(color, fogColor.xyz, (len - minDistance) / dDist);

		if(len > maxDistance)
			color = fogColor.xyz;
	}

	gl_FragColor = vec4(color, 1.0);
}