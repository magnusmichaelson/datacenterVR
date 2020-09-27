#!/usr/local/cellar/python/3.7.7/bin/python3
import json, sys 
if (len(sys.argv) < 2):
  print("")
  print("this code needs the name of the obj input file")
  print("")
  exit()
inputObjFile = sys.argv[1]
inputMtlFile = inputObjFile.split('.')[0] + '.mtl'
blocklist = []
materials = {}
with open(inputMtlFile) as fp:
  line = fp.readline()
  while line:
    if (line.startswith('newmtl ')):
      name = line.rstrip("\n").split(' ')[1]
      reading = True
      while reading:
        if (line.startswith('Kd ')):
          rgb = line.rstrip("\n").split(' ')
          red = float(rgb[1])
          green = float(rgb[2])
          blue = float(rgb[3])
          materials[name] = {"red": red,"green": green,"blue": blue}
          reading = False
        line = fp.readline()
    line = fp.readline()
with open(inputObjFile) as fp:
  line = fp.readline()
  while line:
    if (line.startswith('o ')):
      name = line.rstrip("\n").split(' ')[1]
      xmin = None
      xmax = None
      ymin = None
      ymax = None
      zmin = None
      zmax = None
      reading = True
      while reading:
        if (line.startswith('v ')):
          xyz = line.rstrip("\n").split(' ')
          x = float(xyz[1])
          y = float(xyz[3]) * -1
          z = float(xyz[2])
          if (xmin == None):
            xmin = x
          if (xmax == None):
            xmax = x
          if (ymin == None):
            ymin = y
          if (ymax == None):
            ymax = y
          if (zmin == None):
            zmin = z
          if (zmax == None):
            zmax = z
          if (x < xmin): 
            xmin = x
          if (x > xmax):
            xmax = x
          if (y < ymin):
            ymin = y
          if (y > ymax):
            ymax = y
          if (z < zmin):
            zmin = z
          if (z > zmax):
            zmax = z
        if (line.startswith('usemtl')):
          material = line.rstrip("\n").split(' ')[1]
          blocklist.append({
            "name": name,
            "block": {
              "x_location": '%.3f' % ((xmin + xmax) * 0.5),
              "y_location": '%.3f' % ((ymin + ymax) * 0.5),
              "z_location": '%.3f' % ((zmin + zmax) * 0.5),
              "x_dimension": '%.3f' % (xmax - xmin),
              "y_dimension": '%.3f' % (ymax - ymin),
              "z_dimension": '%.3f' % (zmax - zmin),
              "rgb_block_red": '%.3f' % materials[material]["red"],
              "rgb_block_green": '%.3f' % materials[material]["green"],
              "rgb_block_blue": '%.3f' % blue = materials[material]["blue"],
              "draw_lines": 1,
              "rgb_line_red": 0.5,
              "rgb_line_green": 0.5,
              "rgb_line_blue": 0.5
            }
          })
          reading = False
        line = fp.readline()
    line = fp.readline()
print(json.dumps(blocklist, indent=2, sort_keys=True))

#with open( outputJsonFile, 'w' ) as jsonfile:
#  jsonfile.write('<?xml version="1.0" encoding="UTF-8"?>\n')
#  jsonfile.write('<unload>\n')
#  for thing in blocklist:
#    jsonfile.write('<u_dcse_vr_scene action="INSERT_OR_UPDATE">\n')
#    jsonfile.write('<u_room_name>' + roomName + '</u_room_name>\n')
#    jsonfile.write('<u_lines>' + drawLines + '</u_lines>\n')
#    jsonfile.write('<u_x_min>' + str(thing["u_x_min"]) + '</u_x_min>\n')
#    jsonfile.write('<u_x_max>' + str(thing["u_x_max"]) + '</u_x_max>\n')
#    jsonfile.write('<u_y_min>' + str(thing["u_y_min"]) + '</u_y_min>\n')
#    jsonfile.write('<u_y_max>' + str(thing["u_y_max"]) + '</u_y_max>\n')
#    jsonfile.write('<u_z_min>' + str(thing["u_z_min"]) + '</u_z_min>\n')
#    jsonfile.write('<u_z_max>' + str(thing["u_z_max"]) + '</u_z_max>\n')
#    jsonfile.write('<u_red>' + str(thing["u_red"]) + '</u_red>\n')
#    jsonfile.write('<u_green>' + str(thing["u_green"]) + '</u_green>\n')
#    jsonfile.write('<u_blue>' + str(thing["u_blue"]) + '</u_blue>\n')
#    jsonfile.write('<u_tag>' + str(thing["u_tag"]) + '</u_tag>\n')
#    jsonfile.write('</u_dcse_vr_scene>\n')
#  jsonfile.write('</unload>\n')
