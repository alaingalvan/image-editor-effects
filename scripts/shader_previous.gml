shader_index--;

if (shader_index < 0)
{
    shader_index+= ds_list_size(shader_list);
}

cur_shader = ds_list_find_value(shader_list,shader_index);
cur_shader_name = ds_list_find_value(shader_name_list,shader_index);


