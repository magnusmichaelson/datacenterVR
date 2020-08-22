#!/usr/local/cellar/python/3.7.7/bin/python3
import json, sys
if (len(sys.argv) != 2):
  print("this code requires the json file as the argument")
  print("./obj2vr.py datacenter.json")
  exit()
inputJsonFile = sys.argv[1]
filename = inputJsonFile.split('.')[0]

def objExport(data,objFile,mtlFile,objectType):
  # export obj data
  with open( objFile, 'w' ) as obj:
    vert=0
    face=0
    for block in data:
      if (block["type"] == objectType):
        name = block['name']
        x_min = block["block"]['x_location'] - (block["block"]['x_dimension'] * 0.5)
        x_max = block["block"]['x_location'] + (block["block"]['x_dimension'] * 0.5)
        y_min = block["block"]['y_location'] - (block["block"]['y_dimension'] * 0.5)
        y_max = block["block"]['y_location'] + (block["block"]['y_dimension'] * 0.5)
        z_min = block["block"]['z_location'] - (block["block"]['z_dimension'] * 0.5)
        z_max = block["block"]['z_location'] + (block["block"]['z_dimension'] * 0.5)
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
  with open( mtlFile, 'w' ) as mtl:
    for block in data:
      if (block["type"] == objectType):
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
        
# get the json from the exporter
with open(inputJsonFile, 'r', encoding='utf-8') as json_data:
   data = json.loads(json_data.read())
objExport(data,filename + "_racks.obj",filename + "_racks.mtl","rack")
objExport(data,filename + "_scene.obj",filename + "_scene.mtl","scene")
objExport(data,filename + "_mount.obj",filename + "_mount.mtl","mount")
objExport(data,filename + "_empty.obj",filename + "_empty.mtl","empty")

