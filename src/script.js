var bottomImgDom = document.getElementById("bottomLayerImg");
var topImgDom = document.getElementById('topLayerImg');
var bottomLayerImg = bottomImgDom.src;
var topLayerImg = topImgDom.src;
var effects = {
    overlay: "\n// \uD83C\uDF26\uFE0F Overlay\nvec4 overlay(vec4 col, vec4 blend)\n{\n    vec4 outColor = vec4(0., 0., 0., col.a);\n\n    if (col.r > 0.5)\n    {\n        outColor.r = (1.0 - (1.0 - 2.0 * (col.r - 0.5)) * (1.0 - blend.r));\n    }\n    else\n    {\n        outColor.r = ((2.0 * col.r) * blend.r);\n    }\n\n    if (col.g > 0.5)\n    {\n        outColor.g = (1.0 - (1.0 - 2.0 * (col.g - 0.5)) * (1.0 - blend.g));\n    }\n    else\n    {\n        outColor.g = ((2.0 * col.g) * blend.g);\n    }\n\n    if (col.b > 0.5)\n    {\n        outColor.b = (1.0 - (1.0 - 2.0 * (col.b - 0.5)) * (1.0 - blend.b));\n    }\n    else\n    {\n        outColor.b = ((2.0 * col.b) * blend.b);\n    }\n\n    return mix(col, outColor, blend.a);\n}\n",
    multiply: "\n// \u2734\uFE0F Multiply\nvec4 multiply(vec4 col, vec4 blend)\n{\n  return vec4(mix(col.rgb, col.rgb * blend.rgb, blend.a), col.a);\n}",
    dissolve: "\n//\uD83D\uDD00 iq's random functions:\nfloat rand(float seed)\n{\n  return abs(fract(sin(seed) * 43758.5453123));\n}\n\nfloat rand(vec2 seed)\n{\n    return rand(dot(seed, vec2(12.9898, 78.233)));\n}\n\n// \uD83E\uDD64 Dissolve\nvec4 dissolve(vec4 col, vec4 blend)\n{\n  return vec4(mix(col.rgb, blend.rgb, blend.a > rand(vFragCoord) ? 1.0 : 0.0), col.a);\n}",
    darken: "\n// \uD83C\uDF18 Darken\nvec4 darken(vec4 col, vec4 blend)\n{\n  return vec4(mix(col.rgb, min(col.rgb, blend.rgb), blend.a), col.a);\n}",
    lighten: "\n// \uD83C\uDF14 Lighten\nvec4 lighten(vec4 col, vec4 blend)\n{\n  return vec4(mix(col.rgb, max(col.rgb, blend.rgb), blend.a), col.a);\n}",
    screen: "\n// \uD83D\uDD05 Screen\nvec4 screen(vec4 col, vec4 blend)\n{\n  return vec4(mix(col.rgb, 1.0 - (1.0 - col.rgb) * (1.0 - blend.rgb), blend.a), col.a);\n}",
    divide: "\n// \uD83D\uDDC2\uFE0F Divide\nvec4 divide(vec4 col, vec4 blend)\n{\n  return vec4(mix(col.rgb, sign(blend.rgb) * col.rgb / clamp(blend.rgb, 0.00001, 1.0), blend.a), col.a);\n}",
    'color dodge': "\n// \uD83C\uDF05 Color Dodge\nvec4 colorDodge(vec4 col, vec4 blend)\n{\n  return vec4(mix(col.rgb, col.rgb / clamp(1.0 - blend.rgb, 0.00001, 1.0), blend.a), col.a);\n}",
    'linear dodge': "\n// \u2600\uFE0F Linear Dodge\nvec4 linearDodge(vec4 col, vec4 blend)\n{\n  return vec4(mix(col.rgb, col.rgb + blend.rgb, blend.a), col.a);\n}",
    'color burn': "\n// \uD83D\uDD6F\uFE0F Color Burn\nvec4 colorBurn(vec4 col, vec4 blend)\n{\n  return vec4(mix(col.rgb, 1.0 - (1.0 - col.rgb) / clamp(blend.rgb, 0.00001, 1.0), blend.a), col.a);\n}",
    'linear burn': "\n// \uD83D\uDD25 Linear Burn\nvec4 linearBurn(vec4 col, vec4 blend)\n{\n  return vec4(mix(col.rgb, max(col.rgb - (1.0 - blend.rgb), 0.0), blend.a), col.a);\n}",
    'exclusion': "\n// \uD83E\uDD51 Exclusion\nvec4 exclusion(vec4 col, vec4 blend)\n{\n  return vec4(mix(col.rgb, 0.5 - 2.0 * (col.rgb - 0.5) * (blend.rgb - 0.5), blend.a), col.a);\n}",
    'difference': "\n// \uD83D\uDC41\uFE0F Difference\nvec4 difference(vec4 col, vec4 blend)\n{\n  return vec4(mix(col.rgb, abs(col.rgb - blend.rgb), blend.a), col.a);\n}"
};
var curEffect = effects.overlay;
var canvas = document.getElementById('game');
var compiled, gui;
var gl = canvas.getContext('webgl');
if (!gl) {
    throw new Error('Could not create WebGL Context!');
}
var ndcQuad = [1.0, -1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0];
var indices = [0, 1, 2, 1, 2, 3];
var dataBuffer = gl.createBuffer();
var indexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, dataBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ndcQuad), gl.STATIC_DRAW);
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
function createProgram(vsSource, fsSource) {
    var vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, vsSource);
    gl.compileShader(vs);
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
        console.error('An error occurred compiling the shader: ' + gl.getShaderInfoLog(vs));
    }
    var fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, fsSource);
    gl.compileShader(fs);
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
        console.error('An error occurred compiling the shader: ' + gl.getShaderInfoLog(fs));
    }
    var program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
    }
    return { vs: vs, fs: fs, program: program };
}
function deleteProgram(_a) {
    var vs = _a.vs, fs = _a.fs, program = _a.program;
    gl.deleteProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
}
var vs = "\nattribute vec2 aPosition;\nvarying vec2 vFragCoord;\n\nvoid main()\n{\n  vFragCoord = (0.5 * aPosition) + vec2(0.5, 0.5);\n  vFragCoord.y  = 1.0 - vFragCoord.y;\n  gl_Position = vec4(aPosition, 0.0, 1.0);\n}\n";
var fs = "\nprecision mediump float;\n\nvarying vec2 vFragCoord;\n\nuniform sampler2D tBottomLayer;\nuniform sampler2D tTopLayer;\n\n" + curEffect + "\n#define effect overlay\n\nvoid main()\n{\n  vec2 uv = vFragCoord;\n  vec4 outColor = vec4(0.0, 0.0, 0.0, 0.0);\n\n  vec4 bottomColor = texture2D(tBottomLayer, uv);\n  vec4 topColor = texture2D(tTopLayer, uv);\n\n  outColor = effect(bottomColor, topColor);\n\n  gl_FragColor = outColor;\n}\n";
compiled = createProgram(vs, fs);
function loadTexture(url) {
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    var pixel = new Uint8Array([0, 0, 128, 255]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
    var img = new Image();
    img.src = url;
    img.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    };
    return tex;
}
var topLayer = loadTexture(topLayerImg);
var bottomLayer = loadTexture(bottomLayerImg);
function draw() {
    gl.useProgram(compiled.program);
    var loc = gl.getAttribLocation(compiled.program, 'aPosition');
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 4 * 2, 0);
    gl.enableVertexAttribArray(loc);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    var shaderTexNumber = 0;
    var bottomLayerLoc = gl.getUniformLocation(compiled.program, 'tBottomLayer');
    gl.uniform1i(bottomLayerLoc, shaderTexNumber);
    gl.activeTexture(gl.TEXTURE0 + shaderTexNumber);
    gl.bindTexture(gl.TEXTURE_2D, bottomLayer);
    shaderTexNumber++;
    var topLayerLoc = gl.getUniformLocation(compiled.program, 'tTopLayer');
    gl.uniform1i(topLayerLoc, shaderTexNumber);
    gl.activeTexture(gl.TEXTURE0 + shaderTexNumber);
    gl.bindTexture(gl.TEXTURE_2D, topLayer);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
}
var resizeHandler = function () {
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
    return s.replace(/^([A-Z])|\s(\w)/g, function (match, p1, p2, offset) {
        if (p2)
            return p2.toUpperCase();
        return p1.toLowerCase();
    });
}
;
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
]);
list.onChange(function (value) {
    console.log('Changing Effect!');
    value = value.toLowerCase();
    curEffect = effects[value];
    fs = "\nprecision mediump float;\n\nvarying vec2 vFragCoord;\n\nuniform sampler2D tBottomLayer;\nuniform sampler2D tTopLayer;\n\n" + curEffect + "\n#define effect " + toCamelCase(value) + "\n\nvoid main()\n{\n  vec2 uv = vFragCoord;\n  vec4 outColor = vec4(0.0, 0.0, 0.0, 0.0);\n\n  vec4 bottomColor = texture2D(tBottomLayer, uv);\n  vec4 topColor = texture2D(tTopLayer, uv);\n\n  outColor = effect(bottomColor, topColor);\n\n  gl_FragColor = outColor;\n}\n";
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
//# sourceMappingURL=script.js.map