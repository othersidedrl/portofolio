package server

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	chiMiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/othersidedrl/portfolio/backend/internal/about"
	"github.com/othersidedrl/portfolio/backend/internal/auth"
	"github.com/othersidedrl/portfolio/backend/internal/health"
	"github.com/othersidedrl/portfolio/backend/internal/hero"
	customMiddleware "github.com/othersidedrl/portfolio/backend/internal/middleware"
	"github.com/othersidedrl/portfolio/backend/internal/project"
	"github.com/othersidedrl/portfolio/backend/internal/testimony"
	"github.com/othersidedrl/portfolio/backend/internal/utils"
)

func NewRouter(
	authHandler *auth.Handler,
	heroHandler *hero.Handler,
	aboutHandler *about.Handler,
	testimonyHandler *testimony.Handler,
	projectHandler *project.Handler,
	jwtService *utils.JWTService,
) http.Handler {
	r := chi.NewRouter()

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"*"}, // frontend origin (use "*" in dev if needed)
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300, // cache preflight response for 5 mins
	}))

	r.Use(chiMiddleware.Logger)
	r.Use(chiMiddleware.Recoverer)

	authGuard := customMiddleware.AuthGuard(jwtService)

	r.Route("/api/v1", func(r chi.Router) {
		// Health check
		r.Get("/health", health.Health)

		// Auth
		r.Route("/auth", func(r chi.Router) {
			r.Post("/login", authHandler.Login)
			r.With(authGuard).Get("/me", authHandler.Me)
		})

		// Hero Section
		r.Route("/hero", func(r chi.Router) {
			r.Get("/", heroHandler.GetHeroPage)
			r.With(authGuard).Patch("/", heroHandler.UpdateHeroPage)
		})

		// About Section
		r.Route("/about", func(r chi.Router) {
			r.Get("/", aboutHandler.GetAboutPage)
			r.With(authGuard).Patch("/", aboutHandler.UpdateAboutPage)

			// About Skills
			r.Route("/skills", func(r chi.Router) {
				r.Get("/", aboutHandler.GetTechnicalSkills)
				r.With(authGuard).Post("/", aboutHandler.CreateTechnicalSkill)
				r.With(authGuard).Patch("/{id}", aboutHandler.UpdateTechnicalSkill)
				r.With(authGuard).Delete("/{id}", aboutHandler.DeleteTechnicalSkill)
			})

			r.Route("/careers", func(r chi.Router) {
				r.Get("/", aboutHandler.GetCareers)
				r.With(authGuard).Post("/", aboutHandler.CreateCareer)
				r.With(authGuard).Patch("/{id}", aboutHandler.UpdateCareer)
				r.With(authGuard).Delete("/{id}", aboutHandler.DeleteCareer)
			})
		})

		// Testimonies
		r.Route("/testimony", func(r chi.Router) {
			r.Get("/", testimonyHandler.GetTestimonyPage)
			r.With(authGuard).Patch("/", testimonyHandler.UpdateTestimonyPage)

			r.Route("/items", func(r chi.Router) {
				r.Get("/", testimonyHandler.GetTestimonies)
				r.Get("/approved", testimonyHandler.GetApprovedTestimonies)
				r.With(authGuard).Post("/", testimonyHandler.CreateTestimony)
				r.With(authGuard).Patch("/{id}", testimonyHandler.UpdateTestimony)
				r.With(authGuard).Patch("/{id}/approve", testimonyHandler.ApproveTestimony)
				r.With(authGuard).Delete("/{id}", testimonyHandler.DeleteTestimony)
			})
		})

		// Project
		r.Route("/project", func(r chi.Router) {
			r.Get("/", projectHandler.GetProjectPage)
			r.With(authGuard).Patch("/", projectHandler.UpdateProjectPage)

			r.Route("/items", func(r chi.Router) {
				r.Get("/", projectHandler.GetProjects)
				r.With(authGuard).Post("/", projectHandler.CreateProject)
				r.With(authGuard).Patch("/{id}", projectHandler.UpdateProject)
				r.With(authGuard).Delete("/{id}", projectHandler.DeleteProject)
			})
		})
	})

	return r
}
