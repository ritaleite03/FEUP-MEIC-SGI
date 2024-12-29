uniform float time;
uniform float amplitude;

void main() {
    float scale = 1.0 + sin(time) * amplitude;
    vec3 scaledPosition = position * scale;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(scaledPosition, 1.0);
}
