package main

import (
	"log"
	"net/http"

	"github.com/joho/godotenv"
	"github.com/othersidedrl/portofolio/backend/internal/database"
)

const PORT string = ":8888"

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}
	server := &http.Server{
		Addr: PORT,
	}
	db := database.ConnectDB()
	defer db.Close()

	log.Printf("🚀 Server is running on http://localhost%s", PORT)

	log.Fatal(server.ListenAndServe())
}