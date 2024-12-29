uniform float time;

void main() {
    vec4 red = vec4(1.0, 0.0, 0.0, 1.0); 
    vec4 white = vec4(1.0, 0.6, 0.6, 1.0);
    float mixFactor = 0.5 + 0.5 * sin(time);
    gl_FragColor = mix(white, red, mixFactor);
}
