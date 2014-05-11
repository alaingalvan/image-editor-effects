view_wview[0] = window_get_width();
view_hview[0] = window_get_height();
view_wport[0] = window_get_width();
view_hport[0] = window_get_height();

window_set_size(global.res_w, global.res_h);
display_reset(global.antialiasing, global.vsync);
window_set_fullscreen(global.fullscreen);
window_center();

room_speed = global.framelimit;
io_clear();
