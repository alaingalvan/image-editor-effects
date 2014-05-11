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
    vec4 object_space_pos = vec4( in_Position.x, in_Position.y, in_Position.z, 1.0);
    gl_Position = gm_Matrices[MATRIX_WORLD_VIEW_PROJECTION] * object_space_pos;
    
    v_vColour = in_Colour;
    v_vTexcoord = in_TextureCoord;
}

//######################_==_YOYO_SHADER_MARKER_==_######################@~//
// Curves Shader
//
varying vec2 v_vTexcoord;
varying vec4 v_vColour;

uniform sampler2D texCurve;

vec4 curves(vec4 inColor, sampler2D texCurve)
{
    return vec4(texture2D(texCurve, vec2(inColor.r, 0.5)).r, texture2D(texCurve, vec2(inColor.g, 0.5)).g, texture2D(texCurve, vec2(inColor.b, 0.5)).b, inColor.a);
}

void main()
{
    vec4 inColor = (v_vColour * texture2D(gm_BaseTexture, v_vTexcoord));
    gl_FragColor = curves(inColor, texCurve);
}
