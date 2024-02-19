import pygraphviz as pgv
from PIL import Image

size = 1.4
image1 = Image.open('images/trafo.png')
image2 = Image.open('images/trafo_vertikal.png')

#img_rotated = image1.rotate(90, expand=True)
#img_rotated.save('images/trafo_vertikal.png')
hdw_skillebryter = image1.height / image1.width # height/width because of cropping in Gim
hdw_trafo = 276 / 210 # height/width because of cropping in Gimp
hdw_trafovertikal = image2.height / image2.width # height/width because of cropping in Gimp
A=pgv.AGraph(rankdir='TB', splines=False, layout='dot')
A.add_node(1, label="", shape='none', image='images/Skillebryter.png', fixedsize=True, imagescale=True, width=size, height=size*hdw_skillebryter)
A.add_node(5, shape="point", width=0)
A.add_node(2, label="", shape='none', image='images/trafo.png', fixedsize=True, imagescale=True, width=size, height=size*hdw_trafo)
A.add_node(3, label="", shape='none', image='images/Skillebryter.png', fixedsize=True, imagescale=True, width=size, height=size*hdw_skillebryter)
A.add_node(4, label="", shape='none', image='images/trafo_vertikal.png', fixedsize=True, imagescale=True, width=size, height=size*hdw_trafovertikal)



A.add_edge(1,5)
A.add_edge(5, 2)
A.add_edge(4, 5, minlen=0.2)
A.subgraph(nbunch=[1, 5, 2, 3],  rank='same',  splines=False, layout="dot") 

A.add_edge(2,3)

A.layout(prog='dot')


A.draw('file.png')
