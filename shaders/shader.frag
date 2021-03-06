precision highp float;
const int MAX_LIGHTS = 8;

struct LightInfo {
    vec3 pos;
    vec3 Ia;
    vec3 Id;
    vec3 Is;
    bool isDirectional;
    bool isActive;
};

struct MaterialInfo {
    vec3 Ka;
    vec3 Kd;
    vec3 Ks;
    float shininess;
};

uniform int uNLights; // Effective number of lights used
uniform LightInfo uLight[MAX_LIGHTS]; // The array of lights present in the scene
uniform MaterialInfo uMaterial;  // The material of the object being drawn
uniform mat4 mView;
uniform mat4 mViewNormals;
varying vec3 fNormal;
varying vec3 vP;
varying vec3 vN;


vec3 forLight(){

    vec3 total = vec3(0,0,0);

    for(int i = 0; i < MAX_LIGHTS; i++){

        if(i <= uNLights){
        LightInfo light = uLight[i];

            if (light.isActive) {
                vec3 P = normalize(vP);

                vec3 N = normalize(vN);

                vec3 L;

                if (light.isDirectional)
                    L = normalize((mViewNormals * (vec4(light.pos, 1))).xyz);
                else
                    L = normalize((mView * vec4(light.pos, 0)).xyz - P);

                vec3 R = normalize(reflect(-L, N));

                vec3 V = normalize(-P);

                vec3 ambient = light.Ia * uMaterial.Ka;

                float diffuseFactor = max(dot(L, N), 0.0);

                vec3 diffuse = light.Id * uMaterial.Kd * diffuseFactor;

                float specularFactor =  pow(max(dot(R, V), 0.0), uMaterial.shininess);

                vec3 specular = light.Is * uMaterial.Ks * specularFactor;

                if(dot(L,N) < 0.0) {
                    specular = vec3(0.0 , 0.0 , 0.0);
                }

                vec3 lightTotal = ambient + diffuse + specular;

                total += lightTotal;
            }
        }
        if(i == uNLights) break;
    }
    return total;
}

void main() {
    vec3 c = fNormal + vec3(1.0, 1.0, 1.0);
    gl_FragColor = vec4(forLight(), 1.0);
}

