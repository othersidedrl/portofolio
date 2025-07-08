package main

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/othersidedrl/portofolio/backend/internal/database"
	"github.com/othersidedrl/portofolio/backend/internal/server"
)

func main() {
	_ = godotenv.Load()
	PORT := os.Getenv("PORT")
	database.ConnectDB()

	handler := server.NewRouter()
	srv := server.StartServer(":"+PORT, handler)

	log.Printf("🚀 Server running on http://localhost:%s", PORT)
	log.Fatal(srv.ListenAndServe())
}
