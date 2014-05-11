//Create a config file that'll save the game settings
//for the next time the user loads up this porgram. 

//Enable if you'd like this functionality
/*
ini_open("config.ini");
global.res_w = ini_read_real("Graphics", "Resolution Width", 960);
global.res_h = ini_read_real("Graphics", "Resolution Height", 640);
global.aspect_ratio = ini_read_real("Graphics", "Aspect Ratio", (global.res_w/global.res_h));
global.fullscreen = ini_read_real("Graphics", "Fullscreen", false);
global.antialiasing = ini_read_real("Graphics", "Anti-aliasing", 0);
global.vsync = ini_read_real("Graphics", "Vsync", false);
global.gamma = ini_read_real("Graphics", "Gamma", 1.0);
global.framelimit = ini_read_real("Graphics", "Frame Limit", 30);

ini_write_real("Graphics", "Resolution Width", global.res_w);
ini_write_real("Graphics", "Resolution Height", global.res_h);
ini_write_real("Graphics", "Aspect Ratio", global.aspect_ratio);
ini_write_real("Graphics", "Fullscreen", global.fullscreen);
ini_write_real("Graphics", "Anti-aliasing", global.antialiasing);
ini_write_real("Graphics", "Vsync", global.vsync);
ini_write_real("Graphics", "Gamma", global.gamma);
ini_write_real("Graphics", "Frame Limit", global.framelimit);
ini_close();
*/

global.res_w = 960;
global.res_h = 640;
global.aspect_ratio = (global.res_w/global.res_h);
global.fullscreen = false;
global.antialiasing = 0;
global.vsync = false;
global.gamma = 1.0;
global.framelimit = 30;

config_apply();
