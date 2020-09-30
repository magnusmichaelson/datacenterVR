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
            "x_location": '%.3f' % ((xmin + xmax) * 0.5),
            "y_location": '%.3f' % ((ymin + ymax) * 0.5),
            "z_location": '%.3f' % ((zmin + zmax) * 0.5),
            "x_dimension": '%.3f' % (xmax - xmin),
            "y_dimension": '%.3f' % (ymax - ymin),
            "z_dimension": '%.3f' % (zmax - zmin),
            "rgb_block_red": '%.3f' % materials[material]["red"],
            "rgb_block_green": '%.3f' % materials[material]["green"],
            "rgb_block_blue": '%.3f' % materials[material]["blue"],
            "draw_lines": 1,
            "rgb_line_red": "0.500",
            "rgb_line_green": "0.500",
            "rgb_line_blue": "0.500"
          })
          reading = False
        line = fp.readline()
    line = fp.readline()
print(json.dumps(blocklist, indent=2, sort_keys=True))
