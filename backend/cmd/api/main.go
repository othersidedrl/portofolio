package main

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/othersidedrl/portfolio/backend/internal/auth"
	"github.com/othersidedrl/portfolio/backend/internal/database"
	"github.com/othersidedrl/portfolio/backend/internal/server"
	"github.com/othersidedrl/portfolio/backend/internal/utils"
)

func main() {
	_ = godotenv.Load()

	// Initialize dependencies
	jwt := utils.NewJWTService()
	authService := auth.NewService(jwt)
	authHandler := auth.NewHandler(authService)

	PORT := os.Getenv("PORT")
	database.ConnectDB()

	router := server.NewRouter(authHandler)
	srv := server.StartServer(":"+PORT, router)

	log.Printf("🚀 Server running on http://localhost:%s", PORT)
	log.Fatal(srv.ListenAndServe())
}
