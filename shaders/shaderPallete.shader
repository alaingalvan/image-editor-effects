//
// passthrough vertex shader
//
attribute vec3 in_Position;                  // (x,y,z)
attribute vec4 in_Colour;                    // (r,g,b,a)
attribute vec2 in_TextureCoord;              // (u,v)
//attribute vec3 in_Normal;                  // (x,y,z)     unused in this shader.

varying vec2 v_vTexcoord;
varying vec4 v_vColour;

void main()
{
    vec4 object_space_pos = vec4( in_Position.x, in_Position.y, in_Position.z, 1.0);
    gl_Position = gm_Matrices[MATRIX_WORLD_VIEW_PROJECTION] * object_space_pos;
    
    v_vColour = in_Colour;
    v_vTexcoord = in_TextureCoord;
}

//######################_==_YOYO_SHADER_MARKER_==_######################@~/**
 * shaderPallete
 * By Alain Galvan
 * Last Updated 20 Feb, 2014
 * Licenced for Public Domain
 */
varying vec2 v_vTexcoord;
varying vec4 v_vColour;

uniform sampler2D texPallete;
uniform float brightness; // [-1, 1]

const int SAMPLES = 16;


float vec3Sum(vec3 v)
{
    return v.r + v.g + v.b;
}


/**
 * returns color in pallete closest to inputed color.
 */
vec4 colorClosest(vec4 inColor, sampler2D texPallete)
{
    vec4 outColor = vec4(0.0,0.0,0.0,0.0);
    float lowestDifference = 3.0;
    for (int i = 0; i < SAMPLES; i++)
    {
        vec4 col = texture2D(texPallete, vec2((float(i) + 0.5) / float(SAMPLES), 0.5));
        float difference = abs(vec3Sum(inColor.rgb) - vec3Sum(col.rgb));
        
        if (difference < lowestDifference)
        {
            lowestDifference = difference;
            outColor = col;
        }
    }
    return outColor;
}

/**
 * returns color processed with brightness / contrast.
 */
vec4 brightnessContrast(vec4 value, float brightness, float contrast)
{
    return vec4((value.rgb - 0.5) * contrast + 0.5 + brightness, value.a);
}
void main()
{
    float bright = clamp(brightness, -1.0, 1.0);
    
    vec4 inColor = (v_vColour * texture2D(gm_BaseTexture, v_vTexcoord));
    inColor = brightnessContrast(inColor, brightness, 1.0);
    vec4 palleteColor = colorClosest(inColor,texPallete);
    
    gl_FragColor = inColor;
}
