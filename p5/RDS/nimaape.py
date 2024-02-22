from typing import Union
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
            