#!/usr/local/cellar/python/3.7.7/bin/python3
import json, sys
if (len(sys.argv) != 3):
  print("this code requires the json file and room name as arguments")
  print("./obj2vr.py datacenter.json roomName")
  exit()
inputJsonFile = sys.argv[1]
room_name = sys.argv[2]
print('<?xml version="1.0" encoding="UTF-8"?>')
print('<unload>')
with open(inputJsonFile, 'r') as json_data:
  data = json.loads(json_data.read())
  vert=0
  face=0
  for block in data:
    print('<u_dcse_vr_scene action="INSERT_OR_UPDATE">')
    print('<u_room_name>' + room_name + '</u_room_name>')
    print('<u_draw_lines>' + str(block["block"]["draw_lines"]) + '</u_draw_lines>')
    print('<u_rgb_block_blue>' + str(block["block"]["rgb_block_blue"]) + '</u_rgb_block_blue>')
    print('<u_rgb_block_green>' + str(block["block"]["rgb_block_green"]) + '</u_rgb_block_green>')
    print('<u_rgb_block_red>' + str(block["block"]["rgb_block_red"]) + '</u_rgb_block_red>')
    print('<u_rgb_line_blue>' + str(block["block"]["rgb_line_blue"]) + '</u_rgb_line_blue>')
    print('<u_rgb_line_green>' + str(block["block"]["rgb_line_green"]) + '</u_rgb_line_green>')
    print('<u_rgb_line_red>' + str(block["block"]["rgb_line_red"]) + '</u_rgb_line_red>')
    print('<u_x_dimension>' + str(block["block"]["x_dimension"]) + '</u_x_dimension>')
    print('<u_x_location>' + str(block["block"]["x_location"]) + '</u_x_location>')
    print('<u_y_dimension>' + str(block["block"]["y_dimension"]) + '</u_y_dimension>')
    print('<u_y_location>' + str(block["block"]["y_location"]) + '</u_y_location>')
    print('<u_z_dimension>' + str(block["block"]["z_dimension"]) + '</u_z_dimension>')
    print('<u_z_location>' + str(block["block"]["z_location"]) + '</u_z_location>')
    print('</u_dcse_vr_scene>')
print('</unload>')