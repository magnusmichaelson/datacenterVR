#!/usr/local/cellar/python/3.7.7/bin/python3
import json, sys
if (len(sys.argv) != 2):
  print("this code requires the json file as the argument")
  print("./obj2vr.py datacenter.json")
  exit()
input_json_file = sys.argv[1]
filename = input_json_file.split('.')[0]
filename_obj = filename + '.obj'
filename_mtl = filename + '.mtl'
# export obj data
with open(input_json_file, 'r') as json_data:
  data = json.loads(json_data.read())
  with open( filename_obj, 'w' ) as obj:
    vert=0
    face=0
    for block in data:
      name = block['name']
      x_min = float(block["block"]['x_location']) - (float(block["block"]['x_dimension']) * 0.5)
      x_max = float(block["block"]['x_location']) + (float(block["block"]['x_dimension']) * 0.5)
      y_min = float(block["block"]['y_location']) - (float(block["block"]['y_dimension']) * 0.5)
      y_max = float(block["block"]['y_location']) + (float(block["block"]['y_dimension']) * 0.5)
      z_min = float(block["block"]['z_location']) - (float(block["block"]['z_dimension']) * 0.5)
      z_max = float(block["block"]['z_location']) + (float(block["block"]['z_dimension']) * 0.5)
      # output to obj file
      obj.write("o {}\n".format(name))
      obj.write("v {} {} {}\n".format(x_max, z_max, -y_max))
      obj.write("v {} {} {}\n".format(x_max, z_min, -y_max))
      obj.write("v {} {} {}\n".format(x_max, z_max, -y_min))
      obj.write("v {} {} {}\n".format(x_max, z_min, -y_min))
      obj.write("v {} {} {}\n".format(x_min, z_max, -y_max))
      obj.write("v {} {} {}\n".format(x_min, z_min, -y_max))
      obj.write("v {} {} {}\n".format(x_min, z_max, -y_min))
      obj.write("v {} {} {}\n".format(x_min, z_min, -y_min))
      obj.write("usemtl {}\n".format(name))
      obj.write("s off\n")
      obj.write("f {} {} {} {}\n".format((vert+1), (vert+5), (vert+7), (vert+3)))
      obj.write("f {} {} {} {}\n".format((vert+4), (vert+3), (vert+7), (vert+8)))
      obj.write("f {} {} {} {}\n".format((vert+8), (vert+7), (vert+5), (vert+6)))
      obj.write("f {} {} {} {}\n".format((vert+6), (vert+2), (vert+4), (vert+8)))
      obj.write("f {} {} {} {}\n".format((vert+2), (vert+1), (vert+3), (vert+4)))
      obj.write("f {} {} {} {}\n".format((vert+6), (vert+5), (vert+1), (vert+2)))
      obj.write("\n")
      vert = vert + 8
  # export mtl data
  with open( filename_mtl, 'w' ) as mtl:
    for block in data:
      name = block['name']
      red = block["block"]['rgb_block_red']
      green = block["block"]['rgb_block_green']
      blue = block["block"]['rgb_block_blue']
      mtl.write("newmtl {}\n".format(name))
      mtl.write("Ns 96.078431\n")
      mtl.write("Ka 1.000000 1.000000 1.000000\n")
      mtl.write("Kd {} {} {}\n".format(red, green, blue))
      mtl.write("Ks 0.500000 0.500000 0.500000\n")
      mtl.write("Ke 0.000000 0.000000 0.000000\n")
      mtl.write("Ni 1.000000\n")
      mtl.write("d 1.000000\n")
      mtl.write("illum 2\n")
      mtl.write("\n")
