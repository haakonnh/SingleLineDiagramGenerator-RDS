package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"
)

// The structure of the returned node json object
type Node struct {
	ID   int64
	Path string
}

// The structure of the returned relation json object
type Relation struct {
	Node1 int64
	Node2 int64
}

// topologicalSort sorts the relations topologically and returns the sorted relations
func topologicalSort(relations []Relation) []Relation {
	// Create a graph and inDegree map
	graph := make(map[int64][]int64) // map from node id to list of neighbor ids
	inDegree := make(map[int64]int)  // map from node id to in-degree

	// Iterate over the relations, adding them to the graph and inDegree map
	for _, relation := range relations {
		if _, ok := graph[relation.Node1]; !ok {
			graph[relation.Node1] = []int64{}
		}
		graph[relation.Node1] = append(graph[relation.Node1], relation.Node2)

		if _, ok := inDegree[relation.Node2]; !ok {
			inDegree[relation.Node2] = 0
		}
		inDegree[relation.Node2]++
	}

	queue := []int64{} // queue of nodes with in-degree 0

	// Add nodes with in-degree 0 to the queue
	for node := range graph {
		if _, ok := inDegree[node]; !ok {
			queue = append(queue, node)
		}
	}

	// Initialize the sorted slice
	sorted := []Relation{}

	// Iterate over the queue, adding the neighbors to the sorted slice and updating the in-degree
	for len(queue) > 0 {
		node := queue[0]
		queue = queue[1:]
		for _, neighbor := range graph[node] {
			edge := Relation{node, neighbor}
			sorted = append(sorted, edge)
			inDegree[neighbor]--
			if inDegree[neighbor] == 0 {
				queue = append(queue, neighbor)
			}
		}
	}

	// Return the sorted slice
	return sorted

}

func nodeHandjobber(w http.ResponseWriter, r *http.Request) {
	err := godotenv.Load() // load db url from .env file
	if err != nil {
		fmt.Println("Error loading .env file")
	}

	// Connect to the database
	conn, err := pgx.Connect(context.Background(), os.Getenv("DB_URL"))
	if err != nil { // if connection failed
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}

	// Close the connection pool
	defer conn.Close(context.Background())

	nodes := []Node{} // initialize the nodes array

	// Query for nodes from the tree table
	rows, err := conn.Query(context.Background(), "select id, path1 from tree")
	if err != nil { // if query failed
		fmt.Fprintf(os.Stderr, "QueryRow failed: %v\n", err)
		os.Exit(1)
	}
	defer rows.Close() // close the rows

	// Iterate over the rows, adding them to the nodes array
	for rows.Next() {
		var id int64
		var path string
		err = rows.Scan(&id, &path)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Scan failed: %v\n", err)
			os.Exit(1)
		}
		nodes = append(nodes, Node{id, path})
	}
	if rows.Err() != nil { // if row iteration failed
		fmt.Fprintf(os.Stderr, "Row iteration failed: %v\n", rows.Err())
		os.Exit(1)
	}

	// Marshal the nodes array to json
	b, err := json.Marshal(nodes)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Marshal failed: %v\n", err)
		os.Exit(1)
	}

	// Write the json to the response
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*") // allow cross-origin requests
	w.Write(b)
}

func relationHandjobber(w http.ResponseWriter, r *http.Request) {
	err := godotenv.Load() // load db url from .env file
	if err != nil {
		fmt.Println("Error loading .env file")
	}

	// Connect to the database
	conn, err := pgx.Connect(context.Background(), os.Getenv("DB_URL"))
	if err != nil { // if connection failed
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}

	// Close the connection pool
	defer conn.Close(context.Background())

	relations := []Relation{} // initialize the relations array

	// Query for relations from the tree table
	rows, err := conn.Query(context.Background(), "select node1_id, node2_id from connections")
	if err != nil { // if query failed
		fmt.Fprintf(os.Stderr, "QueryRow failed: %v\n", err)
		os.Exit(1)
	}
	defer rows.Close() // close the rows

	// Iterate over the rows, adding them to the relations array
	for rows.Next() {
		var node1 int64
		var node2 int64
		err = rows.Scan(&node1, &node2)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Scan failed: %v\n", err)
			os.Exit(1)
		}
		relations = append(relations, Relation{node1, node2})
	}

	if rows.Err() != nil { // if row iteration failed
		fmt.Fprintf(os.Stderr, "Row iteration failed: %v\n", rows.Err())
		os.Exit(1)
	}

	relations = topologicalSort(relations)

	// Marshal the relations array to json
	b, err := json.Marshal(relations)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Marshal failed: %v\n", err)
		os.Exit(1)
	}

	// Write the json to the response
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*") // allow cross-origin requests
	w.Write(b)

}

func main() {
	http.HandleFunc("/nodes", nodeHandjobber)
	http.HandleFunc("/relations", relationHandjobber)
	fmt.Println("Server is running on port 9090")
	log.Fatal(http.ListenAndServe(":9090", nil))

}
