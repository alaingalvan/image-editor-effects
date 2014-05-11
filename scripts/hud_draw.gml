draw_set_color(c_white);
draw_set_font(fon_main12);

draw_text(16 ,16 ,"Current Shader: " + string(shader_index)+". "+ cur_shader_name);
draw_text(16 ,16 + (32*1) ,"HSL: " + string(hue * 100)+ "% | " + string(sat * 100) + "% | " + string(lum * 100) + "%");
draw_text(16 ,16 + (32*2) ,"BC: " + string(brightness * 100)+ "% | " + string(contrast * 100) + "%");
draw_text(16 ,16 + (32*3) ,"WH: " + string(view_wview)+ " | " + string(view_hview));
draw_set_halign(fa_center);
draw_set_valign(fa_middle);
draw_set_font(fon_main24);
draw_text(32 ,360 ,"<");
draw_text(view_wview[0] - 32 ,360 ,">");

draw_set_halign(fa_left);
draw_set_valign(fa_top);
