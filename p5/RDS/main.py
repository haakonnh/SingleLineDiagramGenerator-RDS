from typing import Union
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psycopg
from dotenv import load_dotenv
import os
import json

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
                  # loop through each component fetched and fetch connections
                  return data