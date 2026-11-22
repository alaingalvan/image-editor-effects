export interface Effect {
  label: string;
  fnName: string;
  glsl: string;
}

export const effects: Effect[] = [
  {
    label: 'Dissolve',
    fnName: 'dissolve',
    glsl: `
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
}`
  },
  {
    label: 'Darken',
    fnName: 'darken',
    glsl: `
// 🌘 Darken
vec4 darken(vec4 col, vec4 blend)
{
  return vec4(mix(col.rgb, min(col.rgb, blend.rgb), blend.a), col.a);
}`
  },
  {
    label: 'Lighten',
    fnName: 'lighten',
    glsl: `
// 🌔 Lighten
vec4 lighten(vec4 col, vec4 blend)
{
  return vec4(mix(col.rgb, max(col.rgb, blend.rgb), blend.a), col.a);
}`
  },
  {
    label: 'Multiply',
    fnName: 'multiply',
    glsl: `
// ✴️ Multiply
vec4 multiply(vec4 col, vec4 blend)
{
  return vec4(mix(col.rgb, col.rgb * blend.rgb, blend.a), col.a);
}`
  },
  {
    label: 'Divide',
    fnName: 'divide',
    glsl: `
// 🗂️ Divide
vec4 divide(vec4 col, vec4 blend)
{
  return vec4(mix(col.rgb, sign(blend.rgb) * col.rgb / clamp(blend.rgb, 0.00001, 1.0), blend.a), col.a);
}`
  },
  {
    label: 'Screen',
    fnName: 'screen',
    glsl: `
// 🔅 Screen
vec4 screen(vec4 col, vec4 blend)
{
  return vec4(mix(col.rgb, 1.0 - (1.0 - col.rgb) * (1.0 - blend.rgb), blend.a), col.a);
}`
  },
  {
    label: 'Overlay',
    fnName: 'overlay',
    glsl: `
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
`
  },
  {
    label: 'Color Dodge',
    fnName: 'colorDodge',
    glsl: `
// 🌅 Color Dodge
vec4 colorDodge(vec4 col, vec4 blend)
{
  return vec4(mix(col.rgb, col.rgb / clamp(1.0 - blend.rgb, 0.00001, 1.0), blend.a), col.a);
}`
  },
  {
    label: 'Linear Dodge',
    fnName: 'linearDodge',
    glsl: `
// ☀️ Linear Dodge
vec4 linearDodge(vec4 col, vec4 blend)
{
  return vec4(mix(col.rgb, col.rgb + blend.rgb, blend.a), col.a);
}`
  },
  {
    label: 'Color Burn',
    fnName: 'colorBurn',
    glsl: `
// 🕯️ Color Burn
vec4 colorBurn(vec4 col, vec4 blend)
{
  return vec4(mix(col.rgb, 1.0 - (1.0 - col.rgb) / clamp(blend.rgb, 0.00001, 1.0), blend.a), col.a);
}`
  },
  {
    label: 'Linear Burn',
    fnName: 'linearBurn',
    glsl: `
// 🔥 Linear Burn
vec4 linearBurn(vec4 col, vec4 blend)
{
  return vec4(mix(col.rgb, max(col.rgb - (1.0 - blend.rgb), 0.0), blend.a), col.a);
}`
  },
  {
    label: 'Exclusion',
    fnName: 'exclusion',
    glsl: `
// 🥑 Exclusion
vec4 exclusion(vec4 col, vec4 blend)
{
  return vec4(mix(col.rgb, 0.5 - 2.0 * (col.rgb - 0.5) * (blend.rgb - 0.5), blend.a), col.a);
}`
  },
  {
    label: 'Difference',
    fnName: 'difference',
    glsl: `
// 👁️ Difference
vec4 difference(vec4 col, vec4 blend)
{
  return vec4(mix(col.rgb, abs(col.rgb - blend.rgb), blend.a), col.a);
}`
  }
];

export const defaultEffect = effects.find(
  (effect) => effect.label === 'Overlay'
) as Effect;
