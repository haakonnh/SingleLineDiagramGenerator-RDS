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

// connectToDB connects to the database and returns the connection, or an error if the connection failed
func connectToDB() (*pgx.Conn, error) {
	err := godotenv.Load() // load db url from .env file
	if err != nil {
		return nil, fmt.Errorf("error loading .env file: %w", err)
	}

	// Connect to the database
	conn, err := pgx.Connect(context.Background(), os.Getenv("DB_URL"))
	if err != nil { // if connection failed
		return nil, fmt.Errorf("unable to connect to database: %w", err)
	}

	return conn, nil
}

// fetchNodes fetches the nodes from the database and returns them
func fetchNodes(conn *pgx.Conn) ([]Node, error) {
	// Query for nodes from the tree table
	rows, err := conn.Query(context.Background(), "select id, path from tree3")
	if err != nil { // if query failed
		fmt.Fprintf(os.Stderr, "QueryRow failed: %v\n", err)
		os.Exit(1)
	}

	nodes := []Node{} // initialize the nodes array

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

	// Return the nodes array and the error
	return nodes, rows.Err()
}

func nodeHandler(w http.ResponseWriter, r *http.Request) {
	// Connect to the database
	conn, err := connectToDB()

	if err != nil { // if connection failed
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}

	// Fetch the nodes from the database
	nodes, err := fetchNodes(conn)

	if err != nil { // if row iteration failed in fetchNodes
		fmt.Fprintf(os.Stderr, "Row iteration failed: %v\n", err)
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

func relationHandler(w http.ResponseWriter, r *http.Request) {
	// Connect to the database
	conn, err := connectToDB()

	if err != nil { // if connection failed
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}

	// Close the connection pool
	defer conn.Close(context.Background())

	relations := []Relation{} // initialize the relations array

	// Query for relations from the tree table
	rows, err := conn.Query(context.Background(), "select node_1, node_2 from connections3") //newtree
	//rows, err := conn.Query(context.Background(), "select node1_id, node2_id from connections")
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

func IDtoPathHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := connectToDB()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}

	nodes, err := fetchNodes(conn)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Row iteration failed: %v\n", err)
		os.Exit(1)
	}

	// Create a map from node id to path
	idToPath := make(map[int64]string)
	for _, node := range nodes {
		idToPath[node.ID] = node.Path
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*") // allow cross-origin requests
	json.NewEncoder(w).Encode(idToPath)
}

func main() {
	http.HandleFunc("/nodes", nodeHandler)
	http.HandleFunc("/relations", relationHandler)
	http.HandleFunc("/idpath", IDtoPathHandler)
	fmt.Println("Server is running on port 9090")
	log.Fatal(http.ListenAndServe(":9090", nil))

}
