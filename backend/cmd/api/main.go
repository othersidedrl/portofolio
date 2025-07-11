package main

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/othersidedrl/portfolio/backend/internal/about"
	"github.com/othersidedrl/portfolio/backend/internal/auth"
	"github.com/othersidedrl/portfolio/backend/internal/database"
	"github.com/othersidedrl/portfolio/backend/internal/hero"
	"github.com/othersidedrl/portfolio/backend/internal/image"
	"github.com/othersidedrl/portfolio/backend/internal/project"
	"github.com/othersidedrl/portfolio/backend/internal/server"
	"github.com/othersidedrl/portfolio/backend/internal/testimony"
	"github.com/othersidedrl/portfolio/backend/internal/utils"
)

func main() {
	_ = godotenv.Load()
	db := database.ConnectDB()
	utils.InitRedis()

	// Utils
	jwt := utils.NewJWTService()

	// Auth
	authService := auth.NewService(jwt)
	authHandler := auth.NewHandler(authService)

	// Hero
	heroRepo := hero.NewGormHeroRepository(db)
	heroService := hero.NewService(heroRepo)
	heroHandler := hero.NewHandler(heroService)

	// About
	aboutRepo := about.NewGormAboutRepository(db)
	aboutService := about.NewService(aboutRepo)
	aboutHandler := about.NewHandler(aboutService)

	// Testimony
	testimonyRepo := testimony.NewGormTestimonyRepository(db)
	testimonyService := testimony.NewService(testimonyRepo)
	testimonyHandler := testimony.NewHandler(testimonyService)

	// Project
	projectRepo := project.NewGormProjectRepository(db)
	projectService := project.NewService(projectRepo)
	projectHandler := project.NewHandler(projectService)

	// Image
	imageService, err := image.NewService()
	if err != nil {
		return
	}
	imageHandler := image.NewHandler(imageService)

	PORT := os.Getenv("PORT")

	router := server.NewRouter(authHandler, heroHandler, aboutHandler, testimonyHandler, projectHandler, imageHandler, jwt)
	srv := server.StartServer(":"+PORT, router)

	log.Printf("🚀 Server running on http://localhost:%s", PORT)
	log.Fatal(srv.ListenAndServe())
}
