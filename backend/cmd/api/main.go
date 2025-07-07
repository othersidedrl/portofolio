package main

import (
	"log"
	"net/http"
)

const PORT string = ":8888"

func main() {
	server := &http.Server{
		Addr: PORT,
	}

	log.Printf("🚀 Server is running on http://localhost%s", PORT)

	log.Fatal(server.ListenAndServe())
}