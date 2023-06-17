uniform vec2 u_mouse;
// float mousePos = float(u_mouse.x + 3.0);

void main() {
    /* 
    
        https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram
        information about values passed by threejs to the shaders
    */
    gl_Position = vec4( position, 3 );
}