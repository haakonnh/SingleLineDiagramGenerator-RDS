import pygraphviz as pgv

A=pgv.AGraph()
A.add_node(1, shape='none', image='images/transformer-3p.png', fixedsize=True, imagescale=True, width=4, height=4)
A.add_node(2, shape='none', image='images/queen.png', fixedsize=True, imagescale=True, width=4, height=4)

A.add_edge(1,2)


A.layout(prog='dot')

A.draw('file.png')
