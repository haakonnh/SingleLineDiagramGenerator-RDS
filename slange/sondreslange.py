import pygraphviz as pgv
from PIL import Image

size = 1.4
image1 = Image.open('images/Skillebryter.png')
img_rotated = image1.rotate(90)
img_rotated.save('images/Skillebryter.png')
hdw_trafo = 276 / 210 # height/width because of cropping in Gimp

A=pgv.AGraph(rankdir='LR', splines=False)
A.add_node(1, label="", shape='none', image='images/Skillebryter.png', fixedsize=True, imagescale=True, width=size, height=size*hdw_trafo)
A.add_node(2, label="", shape='none', image='images/img_rotated.png', fixedsize=True, imagescale=True, width=size, height=size*hdw_trafo)
A.add_node(3, label="", shape='none', image='images/queen.png', fixedsize=True, imagescale=True, width=size, height=size)

A.add_edge(1,2)
A.add_edge(2,3)


A.layout(prog='dot')


A.draw('sondre.png')
