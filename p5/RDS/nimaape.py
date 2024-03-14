""" from typing import Union
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psycopg
#from dotenv import load_dotenv
import os

#load_dotenv()

# API for p5.js to fetch PostgreSQL data

app = FastAPI()


origins = [
    "http://localhost",
    "http://localhost:3000",  
    # Update with your p5.js development origins
    # ... add any other allowed origins
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

@app.get("/diagram_data")
def get_diagram_data():
      with psycopg.connect(dbname="banenor.sorberg-nypan", user="postgres") as conn:
            with conn.cursor() as cur:
                  cur.execute('SELECT * FROM tree')
                  data = cur.fetchall()
                  return data
            
@app.get("/diagram_data_connections")
def get_diagram_data_connections():
      with psycopg.connect(dbname="banenor.sorberg-nypan", user="postgres") as conn:
            with conn.cursor() as cur:
                  cur.execute('SELECT * FROM connections')
                  data = cur.fetchall()
                  return data
             """


from typing import Union
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psycopg
import os
import json
from collections import defaultdict


# API for p5.js to fetch PostgreSQL data

app = FastAPI()


origins = [
    "http://localhost",
    "http://localhost:3000",  
    # Update with your p5.js development origins
    # ... add any other allowed origins
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
);

def topological_sort(data):
      graph = defaultdict(list)
      in_degrees = defaultdict(int)  # Keep track of how many incoming edges each node has

      for edge in data:
            graph[edge['node1']].append(edge['node2'])
            in_degrees[edge['node2']] += 1
      # Build the initial queue correctly:
      queue = []  # Empty to start
      for node in graph:  # Consider every node in the graph
            if node not in in_degrees:  # If it has no recorded incoming edge
                  queue.append(node)    
      sorted_order = []
      while queue:
            node = queue.pop(0)

            for neighbor in graph[node]:
                  edge_object = {
                        "node1": node,
                        "node2": neighbor
                  }
                  sorted_order.append(edge_object)
                  in_degrees[neighbor] -= 1
                  if in_degrees[neighbor] == 0:
                        queue.append(neighbor)

      return sorted_order 



@app.get("/")
def read_root():
    return {"Hello": "World"}

# TODO: Suck data from PostgreSQL and return it to p5.js

@app.get("/diagram_data")
def get_diagram_data():
      with psycopg.connect(dbname="banenor.sorberg-nypan", user="postgres") as conn:
            with conn.cursor() as cur:
                  cur.execute('SELECT id, path1 FROM tree')
                  results = cur.fetchall()
                  
                  data = [
                        {
                              "id": result[0],
                              "path": result[1]
                        }
                        for result in results
                  ]
                  return data

@app.get("/relation_data")
def get_relation_data():
      with psycopg.connect(dbname="banenor.sorberg-nypan", user="postgres") as conn:
            with conn.cursor() as cur:
                  cur.execute('SELECT * FROM connections')
                  results = cur.fetchall()
                  data = [
                        {
                              "rel_id": result[0],
                              "node1": result[1],
                              "node2": result[2],
                        }
                        for result in results
                  ]
                  # loop through each component fetched and fetch connections
                  return topological_sort(data)
            


def get_second_to_last_part(text):
    parts = text.split(".")
    if len(parts) < 3:
        return text
    return parts[-2]

def get_last_part(text):
    parts = text.split(".")
    if not parts:
          return text
    return parts[-1]

def get_parent_name(node_name):
    """Extracts the parent's name from a node's full path 
       (assuming dot-separated hierarchy).
    """
    parts = node_name.split(".")
    if len(parts) > 1:
        return ".".join(parts[:-1])  # Everything except the last part
    else:
        return None  # Node has no parent (it's likely a root)


def has_parent(node, nodes):
    """Checks if a node's potential parent exists in the 'nodes' dictionary."""
    parent_name = get_parent_name(node["name"])
    return parent_name in nodes

def sort_by_hierarchy(data):
    """Sorts a list of (id, path1) tuples based on number of "." in path1."""
    def count_periods(item):
        return item[1].count(".")  # Count occurrences of "."

    return sorted(data, key=count_periods)


@app.get("/tree_data")
def get_tree_data():
    with psycopg.connect(dbname="banenor.sorberg-nypan", user="postgres") as conn:
        with conn.cursor() as cur:
            cur.execute('SELECT id, path1 FROM tree')
            results = cur.fetchall()

    results = sort_by_hierarchy(results)

    nodes = {}  # Dictionary to store nodes by their path1
    for result in results:
        node_name = result[1]
        nodes[node_name] = {"name": node_name, "children": []}

        parent_name = get_parent_name(node_name)  # You'll need this function
        if parent_name in nodes:
            nodes[parent_name]["children"].append(nodes[node_name]) 

    # Find the root node(s) and assemble the tree (assuming single root)
    root_node = None
    for node in nodes.values():
        if not has_parent(node, nodes):  # You might need to define this check
            root_node = node
            break  

    return root_node  # Or a list of roots, depending on your structure

