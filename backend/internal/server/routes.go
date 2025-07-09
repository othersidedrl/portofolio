// internal/server/router.go
package server

import (
	"net/http"
	"os"
	"strings"
	"time"

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

	// Get allowed origins from environment
	allowedOriginsEnv := os.Getenv("ALLOWED_ORIGINS")
	var allowedOrigins []string
	if allowedOriginsEnv != "" {
		allowedOrigins = strings.Split(allowedOriginsEnv, ",")
		// Trim whitespace
		for i, origin := range allowedOrigins {
			allowedOrigins[i] = strings.TrimSpace(origin)
		}
	} else {
		// Development fallback
		allowedOrigins = []string{"http://localhost:3000"}
	}

	// Security middleware (applied to all routes)
	r.Use(customMiddleware.SecurityHeaders)
	r.Use(customMiddleware.RequestSizeLimit(10 << 20)) // 10MB limit
	r.Use(customMiddleware.SanitizeInput)

	// Rate limiting (60 requests per minute)
	rateLimiter := customMiddleware.NewRateLimiter(60)
	r.Use(rateLimiter.Handler)

	// CORS configuration with security
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   allowedOrigins,
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token", "X-Requested-With"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300, // cache preflight response for 5 mins
	}))

	// Standard Chi middleware
	r.Use(chiMiddleware.Logger)
	r.Use(chiMiddleware.Recoverer)
	r.Use(chiMiddleware.Timeout(30 * time.Second)) // 30 second timeout
	r.Use(chiMiddleware.Compress(5))               // Gzip compression

	// Content type validation for API routes
	r.Use(customMiddleware.ValidateContentType)

	// Auth middleware
	authGuard := customMiddleware.AuthGuard(jwtService)

	r.Route("/api/v1", func(r chi.Router) {
		// Health check (no auth required)
		r.Get("/health", health.Health)

		// Public routes with rate limiting
		r.Group(func(r chi.Router) {
			// Additional rate limiting for public endpoints
			publicRateLimiter := customMiddleware.NewRateLimiter(30) // 30 requests per minute for public
			r.Use(publicRateLimiter.Handler)

			// Hero Section (public read)
			r.Get("/hero", heroHandler.GetHeroPage)

			// About Section (public read)
			r.Get("/about", aboutHandler.GetAboutPage)
			r.Get("/about/skills", aboutHandler.GetTechnicalSkills)
			r.Get("/about/careers", aboutHandler.GetCareers)

			// Testimonies (public read)
			r.Get("/testimony", testimonyHandler.GetTestimonyPage)
			r.Get("/testimony/items/approved", testimonyHandler.GetApprovedTestimonies)

			// Projects (public read)
			r.Get("/project", projectHandler.GetProjectPage)
			r.Get("/project/items", projectHandler.GetProjects)
		})

		// Auth routes with stricter rate limiting
		r.Route("/auth", func(r chi.Router) {
			// Very strict rate limiting for auth endpoints
			authRateLimiter := customMiddleware.NewRateLimiter(5) // 5 requests per minute
			r.Use(authRateLimiter.Handler)

			r.Post("/login", authHandler.Login)
			r.With(authGuard).Get("/me", authHandler.Me)
		})

		// Protected admin routes
		r.Route("/admin", func(r chi.Router) {
			r.Use(authGuard)
			r.Use(customMiddleware.NoCache) // Prevent caching of admin data

			// Hero Section (admin)
			r.Route("/hero", func(r chi.Router) {
				r.Get("/", heroHandler.GetHeroPage)
				r.Patch("/", heroHandler.UpdateHeroPage)
			})

			// About Section (admin)
			r.Route("/about", func(r chi.Router) {
				r.Get("/", aboutHandler.GetAboutPage)
				r.Patch("/", aboutHandler.UpdateAboutPage)

				// About Skills (admin)
				r.Route("/skills", func(r chi.Router) {
					r.Get("/", aboutHandler.GetTechnicalSkills)
					r.Post("/", aboutHandler.CreateTechnicalSkill)
					r.Patch("/{id}", aboutHandler.UpdateTechnicalSkill)
					r.Delete("/{id}", aboutHandler.DeleteTechnicalSkill)
				})

				// About Careers (admin)
				r.Route("/careers", func(r chi.Router) {
					r.Get("/", aboutHandler.GetCareers)
					r.Post("/", aboutHandler.CreateCareer)
					r.Patch("/{id}", aboutHandler.UpdateCareer)
					r.Delete("/{id}", aboutHandler.DeleteCareer)
				})
			})

			// Testimonies (admin)
			r.Route("/testimony", func(r chi.Router) {
				r.Get("/", testimonyHandler.GetTestimonyPage)
				r.Patch("/", testimonyHandler.UpdateTestimonyPage)

				r.Route("/items", func(r chi.Router) {
					r.Get("/", testimonyHandler.GetTestimonies)
					r.Post("/", testimonyHandler.CreateTestimony)
					r.Patch("/{id}", testimonyHandler.UpdateTestimony)
					r.Patch("/{id}/approve", testimonyHandler.ApproveTestimony)
					r.Delete("/{id}", testimonyHandler.DeleteTestimony)
				})
			})

			// Projects (admin)
			r.Route("/project", func(r chi.Router) {
				r.Get("/", projectHandler.GetProjectPage)
				r.Patch("/", projectHandler.UpdateProjectPage)

				r.Route("/items", func(r chi.Router) {
					r.Get("/", projectHandler.GetProjects)
					r.Post("/", projectHandler.CreateProject)
					r.Patch("/{id}", projectHandler.UpdateProject)
					r.Delete("/{id}", projectHandler.DeleteProject)
				})
			})
		})
	})

	// 404 handler
	r.NotFound(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte(`{"error": "Route not found"}`))
	})

	// Method not allowed handler
	r.MethodNotAllowed(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusMethodNotAllowed)
		w.Write([]byte(`{"error": "Method not allowed"}`))
	})

	return r
}
