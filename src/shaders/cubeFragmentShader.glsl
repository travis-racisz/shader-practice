uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_bgColor;
vec3 colorA = vec3(0.244, 0.123, 0.912);
vec3 colorB = vec3(1, 0.899, 0.122);

float plot(vec2 st, float pct){ 
    return smoothstep( pct-0.01, pct, st.y) - smoothstep( pct, pct+0.01, st.y);
}

void main() {


        vec2 st = gl_FragCoord.xy/u_resolution.xy;
        vec3 color = vec3(u_bgColor);
        vec3 colorC = vec3(0.5, u_mouse);

        vec3 pct = vec3(st.x);
        pct.r = smoothstep(0.0, 1.0, st.x);
        pct.g = pow(st.x, 0.5);
        pct.b = cos(u_bgColor + (st.x * u_mouse.x));

        color = mix(colorA, colorC, u_bgColor);
        // color = mix(color,vec3(1.0,0.2,1.0),plot(st,pct.g));
        // color = mix(color,vec3(0.5,0.8,1.0),plot(st,pct.b));
  
    gl_FragColor= vec4(color,1.0);
}