declare var dat;

var bottomImgDom: HTMLImageElement = document.getElementById("bottomLayerImg") as HTMLImageElement;
var topImgDom: HTMLImageElement = document.getElementById('topLayerImg') as HTMLImageElement;

var bottomLayerImg = bottomImgDom.src;
var topLayerImg = topImgDom.src;

let effects = {
    overlay: `
// 🌦️ Overlay
vec4 overlay(vec4 col, vec4 blend)
{
    vec4 outColor = vec4(0., 0., 0., col.a);

    if (col.r > 0.5)
    {
        outColor.r = (1.0 - (1.0 - 2.0 * (col.r - 0.5)) * (1.0 - blend.r));
    }
    else
    {
        outColor.r = ((2.0 * col.r) * blend.r);
    }

    if (col.g > 0.5)
    {
        outColor.g = (1.0 - (1.0 - 2.0 * (col.g - 0.5)) * (1.0 - blend.g));
    }
    else
    {
        outColor.g = ((2.0 * col.g) * blend.g);
    }

    if (col.b > 0.5)
    {
        outColor.b = (1.0 - (1.0 - 2.0 * (col.b - 0.5)) * (1.0 - blend.b));
    }
    else
    {
        outColor.b = ((2.0 * col.b) * blend.b);
    }

    return mix(col, outColor, blend.a);
}
`,
  multiply: `
// ✴️ Multiply
vec4 multiply(vec4 col, vec4 blend)
{
  return vec4(mix(col.rgb, col.rgb * blend.rgb, blend.a), col.a);
}`,
    dissolve: `
//🔀 iq's random functions:
float rand(float seed)
{
  return abs(fract(sin(seed) * 43758.5453123));
}

float rand(vec2 seed)
{
    return rand(dot(seed, vec2(12.9898, 78.233)));
}

// 🥤 Dissolve
vec4 dissolve(vec4 col, vec4 blend)
{
  return vec4(mix(col.rgb, blend.rgb, blend.a > rand(vFragCoord) ? 1.0 : 0.0), col.a);
}`,
  darken: `
// 🌘 Darken
vec4 darken(vec4 col, vec4 blend)
{
  return vec4(mix(col.rgb, min(col.rgb, blend.rgb), blend.a), col.a);
}`,
  lighten:`
// 🌔 Lighten
vec4 lighten(vec4 col, vec4 blend)
{
  return vec4(mix(col.rgb, max(col.rgb, blend.rgb), blend.a), col.a);
}`,
  screen: `
// 🔅 Screen
vec4 screen(vec4 col, vec4 blend)
{
  return vec4(mix(col.rgb, 1.0 - (1.0 - col.rgb) * (1.0 - blend.rgb), blend.a), col.a);
}`,
  divide: `
// 🗂️ Divide
vec4 divide(vec4 col, vec4 blend)
{
  return vec4(mix(col.rgb, sign(blend.rgb) * col.rgb / clamp(blend.rgb, 0.00001, 1.0), blend.a), col.a);
}`,
  'color dodge': `
// 🌅 Color Dodge
vec4 colorDodge(vec4 col, vec4 blend)
{
  return vec4(mix(col.rgb, col.rgb / clamp(1.0 - blend.rgb, 0.00001, 1.0), blend.a), col.a);
}`,
  'linear dodge': `
// ☀️ Linear Dodge
vec4 linearDodge(vec4 col, vec4 blend)
{
  return vec4(mix(col.rgb, col.rgb + blend.rgb, blend.a), col.a);
}`,
  'color burn': `
// 🕯️ Color Burn
vec4 colorBurn(vec4 col, vec4 blend)
{
  return vec4(mix(col.rgb, 1.0 - (1.0 - col.rgb) / clamp(blend.rgb, 0.00001, 1.0), blend.a), col.a);
}`,
  'linear burn': `
// 🔥 Linear Burn
vec4 linearBurn(vec4 col, vec4 blend)
{
  return vec4(mix(col.rgb, max(col.rgb - (1.0 - blend.rgb), 0.0), blend.a), col.a);
}`,
  'exclusion': `
// 🥑 Exclusion
vec4 exclusion(vec4 col, vec4 blend)
{
  return vec4(mix(col.rgb, 0.5 - 2.0 * (col.rgb - 0.5) * (blend.rgb - 0.5), blend.a), col.a);
}`,
  'difference': `
// 👁️ Difference
vec4 difference(vec4 col, vec4 blend)
{
  return vec4(mix(col.rgb, abs(col.rgb - blend.rgb), blend.a), col.a);
}`
};

// Effects
let curEffect = effects.overlay;

// ⚪ Initialization
let canvas = document.getElementById('game') as HTMLCanvasElement;
let compiled, gui;

var gl = canvas.getContext('webgl');
if (!gl) {
    throw new Error('Could not create WebGL Context!');
}

// 🔲 Create NDC Space Quad (attribute vec2 position)
let ndcQuad = [ 1.0, -1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0 ];
let indices = [ 0, 1, 2, 1, 2, 3 ];

// Create Buffers
let dataBuffer = gl.createBuffer();
let indexBuffer = gl.createBuffer();

// Bind Data/Indices to Buffers
gl.bindBuffer(gl.ARRAY_BUFFER, dataBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ndcQuad), gl.STATIC_DRAW);
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

function createProgram(vsSource: string, fsSource: string) {
    let vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, vsSource);
    gl.compileShader(vs);
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
        console.error('An error occurred compiling the shader: ' + gl.getShaderInfoLog(vs));
    }

    let fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, fsSource);
    gl.compileShader(fs);
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
        console.error('An error occurred compiling the shader: ' + gl.getShaderInfoLog(fs));
    }

    let program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
    }
    return { vs, fs, program };
}

function deleteProgram({ vs, fs, program }) {
    gl.deleteProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
}

let vs = `
attribute vec2 aPosition;
varying vec2 vFragCoord;

void main()
{
  vFragCoord = (0.5 * aPosition) + vec2(0.5, 0.5);
  vFragCoord.y  = 1.0 - vFragCoord.y;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

let fs = `
precision mediump float;

varying vec2 vFragCoord;

uniform sampler2D tBottomLayer;
uniform sampler2D tTopLayer;

${curEffect}
#define effect overlay

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

compiled = createProgram(vs, fs);

// 🖼️ Load Textures
function loadTexture(url: string) {
    let tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    const pixel = new Uint8Array([ 0, 0, 128, 255 ]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
    let img = new Image();
    img.src = url;
    img.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    };
    return tex;
}

let topLayer = loadTexture(topLayerImg);
let bottomLayer = loadTexture(bottomLayerImg);

// 📐 Draw
function draw() {
    // Bind Shaders
    gl.useProgram(compiled.program);
    // Bind Vertex Layout
    let loc = gl.getAttribLocation(compiled.program, 'aPosition');
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 4 * 2, 0);
    gl.enableVertexAttribArray(loc);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Bind Uniforms
    var shaderTexNumber = 0;
    let bottomLayerLoc = gl.getUniformLocation(compiled.program, 'tBottomLayer');
    gl.uniform1i(bottomLayerLoc, shaderTexNumber);
    gl.activeTexture(gl.TEXTURE0 + shaderTexNumber);
    gl.bindTexture(gl.TEXTURE_2D, bottomLayer);
    shaderTexNumber++;
    let topLayerLoc = gl.getUniformLocation(compiled.program, 'tTopLayer');
    gl.uniform1i(topLayerLoc, shaderTexNumber);
    gl.activeTexture(gl.TEXTURE0 + shaderTexNumber);
    gl.bindTexture(gl.TEXTURE_2D, topLayer);

    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
}
let resizeHandler = () => {
    var size = innerWidth < innerHeight ? innerHeight : innerWidth;
    canvas.width = size;
    canvas.height = size * (9.0 / 16.0);
    gl.viewport(0, 0, size, size * (9.0 / 16.0));
    draw();
};

window.addEventListener('resize', resizeHandler);
resizeHandler();

function update() {
    draw();
    requestAnimationFrame(update);
}

requestAnimationFrame(update);

function toCamelCase(s) {
    return s.replace(/^([A-Z])|\s(\w)/g, function(match, p1, p2, offset) {
        if (p2) return p2.toUpperCase();
        return p1.toLowerCase();        
    });
};

//DATGUI Controls
gui = new dat.GUI({ autoPlace: false });
var params = {
    Effect: 'Overlay'
};
var list = gui.add(params, 'Effect', [
    'Dissolve',
    'Darken',
    'Lighten',
    'Multiply',
    'Divide',
    'Screen',
    'Overlay',
    'Color Dodge',
    'Linear Dodge',
    'Color Burn',
    'Linear Burn',
    'Exclusion',
    'Difference',
    //'Curves',
    //'Brightness Contrast',
    //'Gamma',
    //'Hue Saturation Lightness',
    //'Gradient',
    //'Gaussian Blur',
    //'Pixelate',
    //'Sobel',
    //'Sharpen'
]);

list.onChange((value) => {
    console.log('Changing Effect!');
    value = value.toLowerCase();
    curEffect = effects[value];

    fs = `
precision mediump float;

varying vec2 vFragCoord;

uniform sampler2D tBottomLayer;
uniform sampler2D tTopLayer;

${curEffect}
#define effect ${toCamelCase(value)}

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

    deleteProgram(compiled);
    compiled = createProgram(vs, fs);
  console.log(fs);
});

gui.close();
var debugContainer = document.getElementById('debug');
gui.domElement.style.position = 'absolute';
gui.domElement.style.top = '0px';
gui.domElement.style.left = '0px';
debugContainer.appendChild(gui.domElement);
