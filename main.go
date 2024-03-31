package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/hello/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Hello World\n")
	})

	http.Handle("/", http.FileServer(http.Dir("./public")))

	log.Fatal(http.ListenAndServe(":8080", nil))
}
