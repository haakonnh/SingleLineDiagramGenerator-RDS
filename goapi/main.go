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

// The structure of the returned object json object
type Object struct {
	ID   int64
	RD   string
	Type string
}

// The structure of the returned connection JSON object
type Connection struct {
	Object1 int64
	Object2 int64
}

// topologicalSort sorts the connections topologically and returns the sorted connections
func topologicalSort(connections []Connection) []Connection {
	// Create a graph and inDegree map
	graph := make(map[int64][]int64) // map from object id to list of neighbor ids
	inDegree := make(map[int64]int)  // map from object id to in-degree

	// Iterate over the connections, adding them to the graph and inDegree map
	for _, connection := range connections {
		if _, ok := graph[connection.Object1]; !ok {
			graph[connection.Object1] = []int64{}
		}
		graph[connection.Object1] = append(graph[connection.Object1], connection.Object2)

		if _, ok := inDegree[connection.Object2]; !ok {
			inDegree[connection.Object2] = 0
		}
		inDegree[connection.Object2]++
	}

	queue := []int64{} // queue of objects with in-degree 0

	// Add objects with in-degree 0 to the queue
	for object := range graph {
		if _, ok := inDegree[object]; !ok {
			queue = append(queue, object)
		}
	}

	// Initialize the sorted slice
	sorted := []Connection{}

	// Iterate over the queue, adding the neighbors to the sorted slice and updating the in-degree
	for len(queue) > 0 {
		object := queue[0]
		queue = queue[1:]
		for _, neighbor := range graph[object] {
			edge := Connection{object, neighbor}
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

// fetchObjects fetches the objects from the database and returns them
func fetchObjects(conn *pgx.Conn) ([]Object, error) {
	// Query for objects from the tree table
	rows, err := conn.Query(context.Background(), "select id, rd, type from object_table_2")
	if err != nil { // if query failed
		fmt.Fprintf(os.Stderr, "QueryRow failed: %v\n", err)
		os.Exit(1)
	}

	objects := []Object{} // initialize the objects array

	defer rows.Close() // close the rows

	// Iterate over the rows, adding them to the objects array
	for rows.Next() {
		var id int64
		var rd string
		var componentType sql.NullString
		err = rows.Scan(&id, &rd, &componentType)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Scan failed: %v\n", err)
			os.Exit(1)
		}
		objects = append(objects, Object{id, rd, componentType.String})
	}

	// Return the objects array and the error
	return objects, rows.Err()
}

func objectHandler(w http.ResponseWriter, r *http.Request) {
	// Connect to the database
	conn, err := connectToDB()

	if err != nil { // if connection failed
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}

	// Fetch the objects from the database
	objects, err := fetchObjects(conn)

	if err != nil { // if row iteration failed in fetchObjects
		fmt.Fprintf(os.Stderr, "Row iteration failed: %v\n", err)
		os.Exit(1)
	}

	// Marshal the objects array to json
	b, err := json.Marshal(objects)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Marshal failed: %v\n", err)
		os.Exit(1)
	}

	// Write the json to the response
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*") // allow cross-origin requests
	w.Write(b)
}

// connectionHandler handles a connection request which returns the connections in topological order
func connectionHandler(w http.ResponseWriter, r *http.Request) {
	// Connect to the database
	conn, err := connectToDB()

	if err != nil { // if connection failed
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}

	// Close the connection pool
	defer conn.Close(context.Background())

	connections := []Connection{} // initialize the connections array

	// Query for connections from the tree table
	rows, err := conn.Query(context.Background(), "select object1, object2 from connections_2")
	if err != nil { // if query failed
		fmt.Fprintf(os.Stderr, "QueryRow failed: %v\n", err)
		os.Exit(1)
	}
	defer rows.Close() // close the rows

	// Iterate over the rows, adding them to the connections array
	for rows.Next() {
		var object1 int64
		var object2 int64
		err = rows.Scan(&object1, &object2)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Scan failed: %v\n", err)
			os.Exit(1)
		}
		connections = append(connections, Connection{object1, object2})
	}

	if rows.Err() != nil { // if row iteration failed
		fmt.Fprintf(os.Stderr, "Row iteration failed: %v\n", rows.Err())
		os.Exit(1)
	}

	// Sort the connections topologically
	connections = topologicalSort(connections)

	// Marshal the connections array to json
	b, err := json.Marshal(connections)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Marshal failed: %v\n", err)
		os.Exit(1)
	}

	// Write the json to the response
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*") // allow cross-origin requests
	w.Write(b)

}

// queryHandler handles a query request which moves one tree object and its children to another tree object; e.g. http://localhost:9090/query?from=J1.JE2&to=J2
func queryHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := connectToDB()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}
	defer conn.Close(context.Background())

	// Parse the query parameter:
	query := r.URL.Query()

	// Get the "from" and "to" object id from the query
	from := query.Get("from")
	to := query.Get("to")

	// Query for the children of the "from" object
	selectQuery := fmt.Sprintf("SELECT id, rd FROM alternativ4 WHERE rd <@ '%s'", from)
	rows, err := conn.Query(context.Background(), selectQuery)
	if err != nil {
		fmt.Fprintf(os.Stderr, "QueryRow failed: %v\n", err)
		os.Exit(1)
	}

	// Initialize the sourceRDs and sourceIDs arrays
	sourceRDs := []string{}
	sourceIDs := []int64{}
	rowsProcessed := 0

	// Iterate over the rows, updating the RD of each object
	for rows.Next() {
		var rd string
		var id int64
		err = rows.Scan(&id, &rd)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Scan failed: %v\n", err)
			os.Exit(1)
		}

		// Update the RD of the object
		sourceRDs = append(sourceRDs, rd)
		sourceIDs = append(sourceIDs, id)
		rowsProcessed++
	}

	// If no rows were processed, return an error
	if rowsProcessed == 0 {
		w.Write([]byte("Query failed: from object not found"))
		return
	}

	// Close the rows
	rows.Close()

	// Query the to object
	selectQuery = fmt.Sprintf("SELECT rd FROM alternativ4 WHERE rd = '%s'", to)
	rows, err = conn.Query(context.Background(), selectQuery)
	if err != nil {
		fmt.Fprintf(os.Stderr, "QueryRow failed: %v\n", err)
		os.Exit(1)
	}

	// Initialize the destinationRD
	var destinationRD string

	// Iterate over the rows, updating the RD of the destination object
	for rows.Next() {
		rows.Scan(&destinationRD)
	}

	// Close the rows
	rows.Close()

	// If the destination object was not found, return an error
	if destinationRD == "" {
		w.Write([]byte(destinationRD))
		w.Write([]byte("Query failed: to object not found"))
		return
	}

	// Cut the source objects such that they can be appended to the destination object
	substrings := strings.Split(from, ".")
	var cutPart string
	for i, rd := range substrings {
		if i == len(substrings)-1 {
			break
		}
		cutPart += rd + "."
	}

	// Append the cut parts to the destination RD
	appendages := []string{}
	for _, rd := range sourceRDs {
		// Update the RD of the object
		newRD := strings.Replace(rd, cutPart, "", 1)
		appendages = append(appendages, newRD)
	}

	// Actually append the cut parts to the destination RD
	transformedRDs := []string{}
	for _, appendage := range appendages {
		transformedRDs = append(transformedRDs, destinationRD+"."+appendage)
	}

	// Create update query
	var values string
	for i, id := range sourceIDs {
		if i == len(sourceIDs)-1 {
			values += fmt.Sprintf("(%d, '%s'::ltree)\n", id, transformedRDs[i])
			break
		}
		values += fmt.Sprintf("(%d, '%s'::ltree),\n", id, transformedRDs[i])
	}

	// Construct update query, using aliases to update the RD of the source objects
	queryString := fmt.Sprintf("UPDATE alternativ4 AS t SET\n rd = t2.rd\n FROM (VALUES %s) AS t2(id, rd)\n WHERE t2.id = t.id", values)
	_, err = conn.Exec(context.Background(), queryString)
	if err != nil {
		fmt.Fprintf(os.Stderr, "exec failed: %v\n", err)
		w.Write([]byte("Query failed"))
		os.Exit(1)
	}

	// Set headers
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*") // allow cross-origin requests

	// Write response in a structured format
	w.Write([]byte("Source objects:\n"))
	json.NewEncoder(w).Encode(sourceRDs)

	w.Write([]byte("\nDestination object:\n"))
	json.NewEncoder(w).Encode(destinationRD)

	w.Write([]byte("Cut parts: " + cutPart + "\n"))
	json.NewEncoder(w).Encode(appendages)

	w.Write([]byte("\nTransformed RDs:\n"))
	json.NewEncoder(w).Encode(transformedRDs)

	w.Write([]byte("\nQuery string:\n"))
	json.NewEncoder(w).Encode(queryString)

	w.Write([]byte("\nQuery successful"))
}

// IDtoRDHandler handles a request for a map from object id to RD
func IDtoRDHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := connectToDB()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}

	objects, err := fetchObjects(conn)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Row iteration failed: %v\n", err)
		os.Exit(1)
	}

	// Create a map from object id to rd
	idToRD := make(map[int64]string)
	for _, object := range objects {
		idToRD[object.ID] = object.RD
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*") // allow cross-origin requests
	json.NewEncoder(w).Encode(idToRD)
}

func IDtoTypeHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := connectToDB()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}

	objects, err := fetchObjects(conn)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Row iteration failed: %v\n", err)
		os.Exit(1)
	}

	// Create a map from object id to RD
	idToType := make(map[int64]string)
	for _, object := range objects {
		idToType[object.ID] = object.Type
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*") // allow cross-origin requests
	json.NewEncoder(w).Encode(idToType)
}

func main() {
	http.HandleFunc("/objects", objectHandler)
	http.HandleFunc("/connections", connectionHandler)
	http.HandleFunc("/idRD", IDtoRDHandler)
	http.HandleFunc("/idtype", IDtoTypeHandler)
	http.HandleFunc("/query", queryHandler)
	fmt.Println("Server is running on port 9090")
	log.Fatal(http.ListenAndServe(":9090", nil))

}
