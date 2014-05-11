//
// Simple passthrough vertex shader
//
attribute vec3 in_Position;                  // (x,y,z)
attribute vec4 in_Colour;                    // (r,g,b,a)
attribute vec2 in_TextureCoord;              // (u,v)
//attribute vec3 in_Normal;                  // (x,y,z)     unused in this shader.

varying vec2 v_vTexcoord;
varying vec4 v_vColour;

void main()
{
    vec4 object_space_pos = vec4(in_Position.x, in_Position.y, in_Position.z, 1.0);
    gl_Position = gm_Matrices[MATRIX_WORLD_VIEW_PROJECTION] * object_space_pos;
    
    v_vColour = in_Colour;
    v_vTexcoord = in_TextureCoord;
}

//######################_==_YOYO_SHADER_MARKER_==_######################@~//
// Hue Sat Lig Shader
//
varying vec2 v_vTexcoord;
varying vec4 v_vColour;

uniform float hue;
uniform float sat;
uniform float lum;

/*
 * Max, Min Functions.
 */
float maxCom(vec4 col)
{
    return max(col.r, max(col.g,col.b));
}

float minCom(vec4 col)
{
    return min(col.r, min(col.g,col.b));
}
/*
 * Returns a vec4 with components h,s,l,a.
 */
vec4 rgbToHsl(vec4 col)
{
    float maxComponent = maxCom(col);
    float minComponent = minCom(col);
    float dif = maxComponent - minComponent;
    float add = maxComponent + minComponent;
    vec4 outColor = vec4(0.0, 0.0, 0.0, col.a);
    
    if (minComponent == maxComponent)
    {
        outColor.r = 0.0;
    }
    else if (col.r == maxComponent)
    {
        outColor.r = mod(((60.0 * (col.g - col.b) / dif) + 360.0), 360.0);
    }
    else if (col.g == maxComponent)
    {
        outColor.r = (60.0 * (col.b - col.r) / dif) + 120.0;
    }
    else
    {
        outColor.r = (60.0 * (col.r - col.g) / dif) + 240.0;
    }

    outColor.b = 0.5 * add;
    
    if (outColor.b == 0.0)
    {
        outColor.g = 0.0;
    }
    else if (outColor.b <= 0.5)
    {
        outColor.g = dif / add;
    }
    else
    {
        outColor.g = dif / (2.0 - add);
    }
    
    outColor.r /= 360.0;
    
    return outColor;
}
/*
 * Returns a component based on luminocity p, saturation q, and hue h. 
 */
float hueToRgb(float p, float q, float h)
{
    if (h < 0.0)
    {
        h += 1.0;
    }
    else if (h > 1.0)
    {
        h -= 1.0;
    }
    if ((h * 6.0) < 1.0)
    {
        return p + (q - p) * h * 6.0;
    }
    else if ((h * 2.0) < 1.0)
    {
        return q;
    }
    else if ((h * 3.0) < 2.0)
    {
        return p + (q - p) * ((2.0 / 3.0) - h) * 6.0;
    }
    else
    {
        return p;
    }
}
/*
 * Returns a vec4 with components r,g,b,a, based off vec4 col with components h,s,l,a.
 */
vec4 hslToRgb(vec4 col)
{
    vec4 outColor = vec4(0.0, 0.0, 0.0, col.a);
    float p, q, tr, tg, tb;
    if (col.b <= 0.5)
    {
        q = col.b * (1.0 + col.g);
    }
    else
    {
        q = col.b + col.g - (col.b * col.g);
    }

    p = 2.0 * col.b - q;
    tr = col.r + (1.0 / 3.0);
    tg = col.r;
    tb = col.r - (1.0 / 3.0);

    outColor.r = hueToRgb(p, q, tr);
    outColor.g = hueToRgb(p, q, tg);
    outColor.b = hueToRgb(p, q, tb);

    return outColor;
}
/*
 * Main. 
 */
void main()
{
    vec4 inColor = texture2D(gm_BaseTexture, v_vTexcoord);
    
    vec4 hsl = rgbToHsl(inColor);
    hsl.r = mod(hsl.r + hue, 1.0);
    hsl.g = clamp(hsl.g + sat, 0.0, 1.0);
    hsl.b = clamp(hsl.b + lum, 0.0, 1.0);
    
    gl_FragColor = hslToRgb(hsl) * v_vColour;
}
