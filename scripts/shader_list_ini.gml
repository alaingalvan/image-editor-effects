shader_index = 0;
cur_shader = shaderPass;
cur_shader_name = "No Shader";
shader_list = ds_list_create();
shader_name_list = ds_list_create();
ds_list_add(shader_list,shaderPass);
ds_list_add(shader_name_list,"No Shader");

ds_list_add(shader_list,shaderCurves);
ds_list_add(shader_name_list,"Curves");

ds_list_add(shader_list,shaderScreen);
ds_list_add(shader_name_list,"Screen");

ds_list_add(shader_list,shaderMultiply);
ds_list_add(shader_name_list,"Multiply");

ds_list_add(shader_list,shaderOverlay);
ds_list_add(shader_name_list,"Overlay");

ds_list_add(shader_list,shaderColorDodge);
ds_list_add(shader_name_list,"Color Dodge");

ds_list_add(shader_list,shaderColorBurn);
ds_list_add(shader_name_list,"Color Burn");

ds_list_add(shader_list,shaderDivide);
ds_list_add(shader_name_list,"Divide");

ds_list_add(shader_list,shaderExclusion);
ds_list_add(shader_name_list,"Exclusion");

ds_list_add(shader_list,shaderExclusionMobile);
ds_list_add(shader_name_list,"Exclusion Mobile");

ds_list_add(shader_list,shaderHueSatLum);
ds_list_add(shader_name_list,"Hue Saturation Luminocity");

ds_list_add(shader_list,shaderBrightnessContrast);
ds_list_add(shader_name_list,"Brightness Contrast");

ds_list_add(shader_list,shaderGamma);
ds_list_add(shader_name_list,"Gamma");
/*
ds_list_add(shader_list,shaderTimeOfDay);
ds_list_add(shader_name_list,"Time of Day");

ds_list_add(shader_list,shaderAll);
ds_list_add(shader_name_list,"All Shaders Combined");
