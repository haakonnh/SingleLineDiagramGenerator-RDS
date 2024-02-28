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
                  sorted_order.append((node, neighbor))
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