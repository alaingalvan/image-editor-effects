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
// Overlay Shader
//

varying vec2 v_vTexcoord;
varying vec4 v_vColour;

uniform sampler2D texOverlay;

void main()
{
    vec4 inColor = v_vColour * texture2D(gm_BaseTexture, v_vTexcoord);
    vec4 outColor = vec4(0.0, 0.0, 0.0, inColor.a);
    vec4 blend = texture2D(texOverlay, v_vTexcoord);
      
    if (inColor.r > 0.5)
    {
        outColor.r = (1.0 - (1.0 - 2.0 * (inColor.r - 0.5)) * (1.0 - blend.r));
    }
    else
    {   
        outColor.r = ((2.0 * inColor.r) * blend.r);
    }

    if (inColor.g > 0.5)
    {
        outColor.g = (1.0 - (1.0 - 2.0 * (inColor.g - 0.5)) * (1.0 - blend.g));
    }
    else
    {   
        outColor.g = ((2.0 * inColor.g) * blend.g);
    }

    if (inColor.b > 0.5)
    {
        outColor.b = (1.0 - (1.0 - 2.0 * (inColor.b - 0.5)) * (1.0 - blend.b));
    }
    else
    {   
        outColor.b = ((2.0 * inColor.b) * blend.b);
    }
    gl_FragColor = mix(inColor, outColor, blend.a);
}
