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
// A Linear Gradient Shader UNDER CONSTRUCTION
//
varying vec2 v_vTexcoord;
varying vec4 v_vColour;

const int MAX_COL = 8;

uniform vec2 point0; //First point for gradient. Determines gradient magnitude and direction.
uniform vec2 point1; //Second point
uniform int numPoints; // Number of positions
uniform vec4 col[MAX_COL]; // Array of Colors (r,g,b,a)
uniform float pos[MAX_COL]; // Array of positions (x) (from 0.0 to 1.0)

void main()
{
    //v_vTexcoord(0.0 to 1.0 for both componenets. 
    for (int i = 0; i < numPoints; i++)
    {
    
    }
    vec4 outColor;
    
    gl_FragColor = v_vColour * texture2D( gm_BaseTexture, v_vTexcoord );
}

