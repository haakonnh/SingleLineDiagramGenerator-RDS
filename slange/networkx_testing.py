import networkx as nx
import matplotlib.pyplot as plt
from PIL import Image
import numpy as np

G = nx.Graph()


G.add_nodes_from([
    (0, {"img": "images/Skillebryter.png"}),
    (1, {"img": "images/trafo.png"}),
    (2, {"img": "images/SeksjonsIsolator.png"})
])

fig, axs = plt.subplots(1, len(G.nodes))  # Create subplots based on node count

for i, (n, data) in enumerate(G.nodes(data=True)):
    im = Image.open(data["img"])
    im = np.array(im)
    axs[i].imshow(im, extent=[n, n+1, 0, 1])  # Use axs[i] instead of fig
    axs[i].axis('off')

plt.tight_layout()
plt.show()

#nx.draw(G, with_labels=True, font_weight='bold')
#plt.show()