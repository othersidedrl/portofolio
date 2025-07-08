package main

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/othersidedrl/portfolio/backend/internal/auth"
	"github.com/othersidedrl/portfolio/backend/internal/database"
	"github.com/othersidedrl/portfolio/backend/internal/hero"
	"github.com/othersidedrl/portfolio/backend/internal/server"
	"github.com/othersidedrl/portfolio/backend/internal/utils"
)

func main() {
	_ = godotenv.Load()
	db := database.ConnectDB()

	// Utils
	jwt := utils.NewJWTService()

	// Auth
	authService := auth.NewService(jwt)
	authHandler := auth.NewHandler(authService)

	// Hero
	heroRepo := hero.NewGormHeroRepository(db)
	heroService := hero.NewService(heroRepo)
	heroHandler := hero.NewHandler(heroService)

	PORT := os.Getenv("PORT")

	router := server.NewRouter(authHandler, heroHandler, jwt)
	srv := server.StartServer(":"+PORT, router)

	log.Printf("🚀 Server running on http://localhost:%s", PORT)
	log.Fatal(srv.ListenAndServe())
}
