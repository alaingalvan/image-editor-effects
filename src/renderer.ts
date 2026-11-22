import type { Effect } from './effects';

export interface Renderer {
  setEffect(effect: Effect): void;
  destroy(): void;
}

interface Program {
  program: WebGLProgram;
  aPosition: number;
  tBottomLayer: WebGLUniformLocation | null;
  tTopLayer: WebGLUniformLocation | null;
}

const vertexSource = `
attribute vec2 aPosition;
varying vec2 vFragCoord;

void main()
{
  vFragCoord = (0.5 * aPosition) + vec2(0.5, 0.5);
  vFragCoord.y  = 1.0 - vFragCoord.y;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

function fragmentSource(effect: Effect) {
  return `
precision mediump float;

varying vec2 vFragCoord;

uniform sampler2D tBottomLayer;
uniform sampler2D tTopLayer;

${effect.glsl}
#define effect ${effect.fnName}

void main()
{
  vec2 uv = vFragCoord;
  vec4 outColor = vec4(0.0, 0.0, 0.0, 0.0);

  vec4 bottomColor = texture2D(tBottomLayer, uv);
  vec4 topColor = texture2D(tTopLayer, uv);

  outColor = effect(bottomColor, topColor);

  gl_FragColor = outColor;
}
`;
}

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
) {
  const shader = gl.createShader(type) as WebGLShader;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(
      'An error occurred compiling the shader: ' + gl.getShaderInfoLog(shader)
    );
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext, effect: Effect): Program {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource(effect));

  const program = gl.createProgram() as WebGLProgram;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
  }

  // Shaders stay alive until the program that uses them is deleted.
  gl.deleteShader(vs);
  gl.deleteShader(fs);

  return {
    program,
    aPosition: gl.getAttribLocation(program, 'aPosition'),
    tBottomLayer: gl.getUniformLocation(program, 'tBottomLayer'),
    tTopLayer: gl.getUniformLocation(program, 'tTopLayer')
  };
}

function loadTexture(
  gl: WebGLRenderingContext,
  url: string,
  isDestroyed: () => boolean
) {
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  const pixel = new Uint8Array([0, 0, 128, 255]);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    pixel
  );
  const img = new Image();
  img.src = url;
  img.onload = () => {
    if (isDestroyed()) return;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  };
  return tex;
}

export function createRenderer(
  canvas: HTMLCanvasElement,
  bottomLayerUrl: string,
  topLayerUrl: string,
  initialEffect: Effect
): Renderer {
  const context = canvas.getContext('webgl');
  if (!context) {
    throw new Error('Could not create WebGL Context!');
  }
  const gl = context;

  let destroyed = false;
  let frameId = 0;

  // 🔲 Create NDC Space Quad (attribute vec2 position)
  const dataBuffer = gl.createBuffer();
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, dataBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([1.0, -1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0]),
    gl.STATIC_DRAW
  );
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array([0, 1, 2, 1, 2, 3]),
    gl.STATIC_DRAW
  );

  const isDestroyed = () => destroyed;
  const bottomLayer = loadTexture(gl, bottomLayerUrl, isDestroyed);
  const topLayer = loadTexture(gl, topLayerUrl, isDestroyed);

  let current = createProgram(gl, initialEffect);

  // 📐 Draw
  function draw() {
    gl.useProgram(current.program);
    gl.bindBuffer(gl.ARRAY_BUFFER, dataBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.vertexAttribPointer(current.aPosition, 2, gl.FLOAT, false, 4 * 2, 0);
    gl.enableVertexAttribArray(current.aPosition);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniform1i(current.tBottomLayer, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, bottomLayer);

    gl.uniform1i(current.tTopLayer, 1);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, topLayer);

    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  }

  function resize() {
    const size = Math.max(innerWidth, innerHeight);
    const height = size * (9.0 / 16.0);
    canvas.width = size;
    canvas.height = height;
    gl.viewport(0, 0, size, height);
    draw();
  }

  function frame() {
    draw();
    frameId = requestAnimationFrame(frame);
  }

  window.addEventListener('resize', resize);
  resize();
  frameId = requestAnimationFrame(frame);

  return {
    setEffect(effect) {
      gl.deleteProgram(current.program);
      current = createProgram(gl, effect);
    },
    destroy() {
      destroyed = true;
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
      gl.deleteProgram(current.program);
      gl.deleteTexture(bottomLayer);
      gl.deleteTexture(topLayer);
      gl.deleteBuffer(dataBuffer);
      gl.deleteBuffer(indexBuffer);
    }
  };
}
