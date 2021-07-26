import networkx as nx
import matplotlib.pyplot as plt
from networkx.drawing.nx_pydot import graphviz_layout
from networkx.classes.function import path_weight

cues = ["quality_c", "task_social_c", "message_intensity_c", "failure_c", "user_c", "humanlike_c", "xxx_c", "character_c"]
reactions = ["satisfaction_r", "trust_r", "behavior_r", "sales_r", "brand_r"]

G = nx.read_weighted_edgelist("chatbot_fcm.edgelist", create_using=nx.DiGraph)

pos = graphviz_layout(G, prog="dot")
nx.draw(G, pos, with_labels=True)

edge_labels = dict([((n1, n2), d['weight'])
                    for n1, n2, d in G.edges(data=True)])

nx.draw_networkx_edge_labels(G,pos,edge_labels=edge_labels,font_color='red', label_pos=0.8)
plt.show()

# input
print("Please select one of the following reactions you want to obtain from your chatbot:")

print("{:<7} {:<10}".format("Number", "Reaction"))
print("----------------------------------------")
for i in range(len(reactions)):
	print("{:<7} {:<10}".format(i, reactions[i]))
print("----------------------------------------")

inp = int(input())

print("Selecting best cues to obtain " + reactions[inp] + " as a reaction...")

path_length = {}
for c in cues:
	total_length = 0
	for path in nx.all_simple_paths(G, source=c, target=reactions[inp]):
		total_length += path_weight(G, path, weight="weight")
	
	path_length[c] = total_length

res = dict(sorted(path_length.items(), key=lambda item: item[1], reverse=True))

# Print result:
print("")
print("{:<25} {:<10}".format("Cue", "Score"))
print("----------------------------------------")
for k,v in res.items():
	print("{:<25} {:<10}".format(k, v))
print("----------------------------------------")
print("")