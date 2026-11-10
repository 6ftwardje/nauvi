"use client";

import { useEffect, useRef } from "react";

export const fluidDotsDurationMs = 1150;

const vertex = `
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

// Adapted from the supplied Siri fluid-dots shader. Opposing dots pass through
// each other and merge as signed-distance fields before gathering at the centre.
const fragment = `
precision mediump float;
uniform float time;
uniform vec2 resolution;
const float TAU = 6.2831853;

float merge(float a, float b) {
  float overlap = max(0.075 - abs(a - b), 0.0) / 0.075;
  return min(a, b) - overlap * overlap * 0.075 * 0.25;
}

void main() {
  vec2 point = (2.0 * gl_FragCoord.xy / resolution - 1.0) * 0.4;
  float gather = smoothstep(0.43, 0.72, time);
  float field = 1.0;

  for (int i = 0; i < 6; i++) {
    float index = float(i);
    float angle = TAU * index / 6.0 + time * 2.4;
    float stagger = mod(index, 3.0) * 0.085;
    float travel = smoothstep(stagger, stagger + 0.38, time) * step(index, 2.0);
    float distanceFromCenter = mix(0.19, -0.14, travel);
    vec2 center = vec2(cos(angle), sin(angle)) * mix(distanceFromCenter, 0.0, gather);
    float radius = mix(0.047 + 0.009 * sin(time * 9.0 + index), 0.075, gather);
    field = merge(field, length(point - center) - radius);
  }

  float core = 1.0 - smoothstep(-0.008, 0.017, field);
  float halo = 0.22 * (1.0 - smoothstep(0.0, 0.08, field));
  gl_FragColor = vec4(0.086, 0.059, 0.047, max(core, halo));
}
`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  gl.deleteShader(shader);
  return null;
}

export function SiriFluidDots({ playing }: { playing: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !playing) return;
    delete canvas.dataset.ready;
    const gl = canvas.getContext("webgl", {
      premultipliedAlpha: false,
      preserveDrawingBuffer: true,
      powerPreference: "low-power",
    });
    if (!gl || gl.isContextLost()) return;
    const vs = compile(gl, gl.VERTEX_SHADER, vertex);
    const fs = compile(gl, gl.FRAGMENT_SHADER, fragment);
    const program = gl.createProgram();
    const buffer = gl.createBuffer();
    let animation = 0;
    const dispose = () => {
      cancelAnimationFrame(animation);
      gl.useProgram(null);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
    };
    if (!vs || !fs || !program || !buffer) return dispose;

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return dispose;
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(gl.getUniformLocation(program, "resolution"), canvas.width, canvas.height);
    const time = gl.getUniformLocation(program, "time");
    const start = performance.now();

    const draw = (now: number) => {
      if (gl.isContextLost()) {
        delete canvas.dataset.ready;
        return;
      }
      const progress = Math.min((now - start) / fluidDotsDurationMs, 1);
      gl.uniform1f(time, progress * 0.74);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!canvas.hasAttribute("data-ready")) canvas.dataset.ready = "";
      if (progress < 1) animation = requestAnimationFrame(draw);
    };
    animation = requestAnimationFrame(draw);
    return dispose;
  }, [playing]);

  return <span aria-hidden="true">
    <canvas ref={ref} width={48} height={48} />
    <i><b /><b /><b /><b /><b /><b /></i>
  </span>;
}
