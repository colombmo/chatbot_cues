import networkx as nx

G = nx.read_edgelist("chatbot_fcm.edgelist", nodetype=str, data=(("weight", float),))
print(list(G))
print(list(G.edges(data=True)))

print(nx.shortest_path(G, 'quality_c', 'humanlike_c', weight='weight', method='dijkstra'))
