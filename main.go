package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/siuyin/dflt"
	"github.com/siuyin/mediarec/internal/public"
)

func main() {
	http.HandleFunc("/hello/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Hello World\n")
	})

	// http.Handle("/", http.FileServer(http.Dir("./internal/public"))) // uncomment for development
	http.Handle("/", http.FileServerFS(public.Content)) // uncomment for deployment

	log.Fatal(http.ListenAndServe(":"+dflt.EnvString("HTTP_PORT", "8080"), nil))
}
