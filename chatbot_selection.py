import networkx as nx
import matplotlib.pyplot as plt
from networkx.drawing.nx_pydot import graphviz_layout
from networkx.classes.function import path_weight

G = nx.read_weighted_edgelist("chatbot_fcm.edgelist", create_using=nx.DiGraph)

pos = graphviz_layout(G, prog="dot")
nx.draw(G, pos, with_labels=True)

edge_labels = dict([((n1, n2), d['weight'])
                    for n1, n2, d in G.edges(data=True)])

nx.draw_networkx_edge_labels(G,pos,edge_labels=edge_labels,font_color='red', label_pos=0.8)
plt.show()


total_length = 0
for path in nx.all_simple_paths(G, source="task_social_c", target="satisfaction_r"):
	total_length += path_weight(G, path, weight="weight")

print("Total length of all paths from task_social_c to satisfaction_r: ", total_length)