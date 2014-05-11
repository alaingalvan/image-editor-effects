if (cur_shader == shaderCurves)
{
    texture_set_stage(color_curve,background_get_texture(bac_colorcurve));
}
if  (cur_shader == shaderScreen)
{
    texture_set_stage(tex_screen,background_get_texture(bac_overlay));
}
if  (cur_shader == shaderMultiply)
{
    texture_set_stage(tex_multiply,background_get_texture(bac_multiply));
}
if  (cur_shader == shaderOverlay)
{
    texture_set_stage(tex_overlay,background_get_texture(bac_overlay));
}
if  (cur_shader == shaderColorDodge)
{
    texture_set_stage(tex_colordodge,background_get_texture(bac_dodge));
}
if  (cur_shader == shaderColorBurn)
{
    texture_set_stage(tex_colorburn,background_get_texture(bac_burn));
}
if  (cur_shader == shaderDivide)
{
    texture_set_stage(tex_divide,background_get_texture(bac_overlay));
}
if  (cur_shader == shaderExclusion)
{
    texture_set_stage(tex_exclusion,background_get_texture(bac_exclude));
}
if  (cur_shader == shaderExclusionMobile)
{
    shader_set_uniform_f(uniform_display_width,display_width);
    shader_set_uniform_f(uniform_display_height,display_height);
    shader_set_uniform_f(uniform_display_button,display_button);
    texture_set_stage(tex_exclusion_moible,background_get_texture(bac_exclude));
}
if  (cur_shader == shaderHueSatLum)
{
    shader_set_uniform_f(uniform_hue,hue);
    shader_set_uniform_f(uniform_sat,sat);
    shader_set_uniform_f(uniform_lum,lum);
}
if  (cur_shader == shaderBrightnessContrast)
{
    shader_set_uniform_f(uniform_brightness,brightness);
    shader_set_uniform_f(uniform_contrast,contrast);
}
if  (cur_shader == shaderGamma)
{
    shader_set_uniform_f(uniform_gamma,gamma);
}
