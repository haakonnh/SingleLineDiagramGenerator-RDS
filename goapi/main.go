package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"
)

// The structure of the returned node json object
type Node struct {
	ID   int64
	Path string
	Type string
}

// The structure of the returned relation JSON object
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
	rows, err := conn.Query(context.Background(), "select id, path, type from alternativ4")
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
		var componentType sql.NullString
		err = rows.Scan(&id, &path, &componentType)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Scan failed: %v\n", err)
			os.Exit(1)
		}
		nodes = append(nodes, Node{id, path, componentType.String})
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
	rows, err := conn.Query(context.Background(), "select node1, node2 from connections4") //newtree
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

// queryHandler handles a query request which moves one tree node and its children to another tree node; e.g. http://localhost:9090/query?from=J1.JE2&to=J2
func queryHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := connectToDB()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}
	defer conn.Close(context.Background())

	// Parse the query parameter:
	query := r.URL.Query()

	// Get the "from" and "to" node id from the query
	from := query.Get("from")
	to := query.Get("to")

	// Query for the children of the "from" node
	selectQuery := fmt.Sprintf("SELECT id, path FROM alternativ4 WHERE path <@ '%s'", from)
	rows, err := conn.Query(context.Background(), selectQuery)
	if err != nil {
		fmt.Fprintf(os.Stderr, "QueryRow failed: %v\n", err)
		os.Exit(1)
	}

	sourcePaths := []string{}
	sourceIDs := []int64{}
	rowsProcessed := 0

	// Iterate over the rows, updating the path of each node
	for rows.Next() {
		var path string
		var id int64
		err = rows.Scan(&id, &path)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Scan failed: %v\n", err)
			os.Exit(1)
		}

		// Update the path of the node
		sourcePaths = append(sourcePaths, path)
		sourceIDs = append(sourceIDs, id)
		rowsProcessed++
	}

	if rowsProcessed == 0 {
		w.Write([]byte("Query failed: from node not found"))
		return
	}
	rows.Close()

	// Query the to node
	selectQuery = fmt.Sprintf("SELECT path FROM alternativ4 WHERE path = '%s'", to)
	rows, err = conn.Query(context.Background(), selectQuery)
	if err != nil {
		fmt.Fprintf(os.Stderr, "QueryRow failed: %v\n", err)
		os.Exit(1)
	}

	var destinationPath string
	for rows.Next() {
		rows.Scan(&destinationPath)
	}

	rows.Close()

	if destinationPath == "" {
		w.Write([]byte(destinationPath))
		w.Write([]byte("Query failed: to node not found"))
		return
	}
	// Cut the source nodes such that they can be appended to the destination node
	substrings := strings.Split(from, ".")
	var cutPart string
	for i, path := range substrings {
		if i == len(substrings)-1 {
			break
		}
		cutPart += path + "."
	}

	appendages := []string{}
	for _, path := range sourcePaths {
		// Update the path of the node
		newPath := strings.Replace(path, cutPart, "", 1)
		appendages = append(appendages, newPath)
	}

	// Actually append the cut parts to the destination path
	transformedPaths := []string{}
	for _, appendage := range appendages {
		transformedPaths = append(transformedPaths, destinationPath+"."+appendage)
	}

	// Create update query
	var values string
	for i, id := range sourceIDs {
		if i == len(sourceIDs)-1 {
			values += fmt.Sprintf("(%d, '%s'::ltree)\n", id, transformedPaths[i])
			break
		}
		values += fmt.Sprintf("(%d, '%s'::ltree),\n", id, transformedPaths[i])
	}

	// Construct update query, using aliases to update the path of the source nodes
	queryString := fmt.Sprintf("UPDATE alternativ4 AS t SET\n path = t2.path\n FROM (VALUES %s) AS t2(id, path)\n WHERE t2.id = t.id", values)
	_, err = conn.Exec(context.Background(), queryString)
	if err != nil {
		fmt.Fprintf(os.Stderr, "exec failed: %v\n", err)
		w.Write([]byte("Query failed"))
		os.Exit(1)
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*") // allow cross-origin requests
	w.Write([]byte("Source nodes:\n"))
	json.NewEncoder(w).Encode(sourcePaths)

	w.Write([]byte("\nDestination node:\n"))
	json.NewEncoder(w).Encode(destinationPath)

	w.Write([]byte("Cut parts: " + cutPart + "\n"))
	json.NewEncoder(w).Encode(appendages)

	w.Write([]byte("\nTransformed paths:\n"))
	json.NewEncoder(w).Encode(transformedPaths)

	w.Write([]byte("\nQuery string:\n"))
	json.NewEncoder(w).Encode(queryString)

	w.Write([]byte("\nQuery successful"))
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

func IDtoTypeHandler(w http.ResponseWriter, r *http.Request) {
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
	idToType := make(map[int64]string)
	for _, node := range nodes {
		idToType[node.ID] = node.Type
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*") // allow cross-origin requests
	json.NewEncoder(w).Encode(idToType)
}

func main() {
	http.HandleFunc("/nodes", nodeHandler)
	http.HandleFunc("/relations", relationHandler)
	http.HandleFunc("/idpath", IDtoPathHandler)
	http.HandleFunc("/idtype", IDtoTypeHandler)
	http.HandleFunc("/query", queryHandler)
	fmt.Println("Server is running on port 9090")
	log.Fatal(http.ListenAndServe(":9090", nil))

}
