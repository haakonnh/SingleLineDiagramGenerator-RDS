from typing import Union
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psycopg
from dotenv import load_dotenv
import os
import json
import collections

load_dotenv()

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


@app.get("/")
def read_root():
    return {"Hello": "World"}

# TODO: Suck data from PostgreSQL and return it to p5.js

@app.get("/diagram_data")
def get_diagram_data():
      with psycopg.connect(dbname="dabase", user="postgres", password=os.environ['HAAKON_PASSORD']) as conn:
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
      with psycopg.connect(dbname="dabase", user="postgres", password=os.environ['HAAKON_PASSORD']) as conn:
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
                  
                  # Building the temporary dictionary
                  node_connections = collections.defaultdict(list)
                  for item in data:
                        node_connections[item['node1']].append(item['node2'])

                  # Finding the starting node   
                  all_nodes = set(item['node1'] for item in data) # Collect all 'node1' values
                  all_node2 = set(item['node2'] for item in data)  # Collect all 'node2' values
                  start_node = (all_nodes - all_node2).pop()

                  # Reconstructing the sorted path
                  sorted_path = []
                  current_node = start_node
                  while current_node in node_connections:
                        sorted_path.append(current_node)
                        current_node = node_connections[current_node].pop()
                  sorted_path.append(current_node) 
                  print(sorted_path) 
                  return data