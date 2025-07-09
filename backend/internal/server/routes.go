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
		for i, origin := range allowedOrigins {
			allowedOrigins[i] = strings.TrimSpace(origin)
		}
	} else {
		allowedOrigins = []string{"http://localhost:3000"}
	}

	r.Use(customMiddleware.SecurityHeaders)
	r.Use(customMiddleware.RequestSizeLimit(10 << 20)) // 10MB limit
	r.Use(customMiddleware.SanitizeInput)

	// Rate limiting (60 requests per minute)
	rateLimiter := customMiddleware.NewRateLimiter(60)
	r.Use(rateLimiter.Handler)

	// CORS
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   allowedOrigins,
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token", "X-Requested-With"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300, // 5 mins
	}))

	// Standard Chi middleware
	r.Use(chiMiddleware.Logger)
	r.Use(chiMiddleware.Recoverer)
	r.Use(chiMiddleware.Timeout(30 * time.Second))
	r.Use(chiMiddleware.Compress(5))

	// Content type validation for API routes
	r.Use(customMiddleware.ValidateContentType)

	// Auth middleware
	authGuard := customMiddleware.AuthGuard(jwtService)

	// Redis
	redis := utils.RedisClient
	// Cache TTLs
	pageTTL := time.Hour
	sectionTTL := 30 * time.Minute

	r.Route("/api/v1", func(r chi.Router) {
		r.Get("/health", health.Health)

		// Public
		r.Group(func(r chi.Router) {
			publicRateLimiter := customMiddleware.NewRateLimiter(30) // 30 requests per minute for public
			r.Use(publicRateLimiter.Handler)

			// Hero Section (public)
			r.Get("/hero", customMiddleware.RedisCache(redis, "hero_page_cache", pageTTL, heroHandler.GetHeroPage))

			// About Section (public)
			r.Get("/about", customMiddleware.RedisCache(redis, "about_page_cache", pageTTL, aboutHandler.GetAboutPage))
			r.Get("/about/skills", customMiddleware.RedisCache(redis, "about_skills_cache", sectionTTL, aboutHandler.GetTechnicalSkills))
			r.Get("/about/careers", customMiddleware.RedisCache(redis, "about_careers_cache", sectionTTL, aboutHandler.GetCareers))

			// Testimonies (public)
			r.Get("/testimony", customMiddleware.RedisCache(redis, "testimony_page_cache", pageTTL, testimonyHandler.GetTestimonyPage))
			r.Get("/testimony/items/approved", customMiddleware.RedisCache(redis, "testimony_approved_cache", sectionTTL, testimonyHandler.GetApprovedTestimonies))

			// Projects (public)
			r.Get("/project", customMiddleware.RedisCache(redis, "project_page_cache", pageTTL, projectHandler.GetProjectPage))
			r.Get("/project/items", customMiddleware.RedisCache(redis, "project_items_cache", sectionTTL, projectHandler.GetProjects))
		})

		// Auth
		r.Route("/auth", func(r chi.Router) {
			authRateLimiter := customMiddleware.NewRateLimiter(5)
			r.Use(authRateLimiter.Handler)

			r.Post("/login", authHandler.Login)
			r.With(authGuard).Get("/me", authHandler.Me)
		})

		// Admin
		r.Route("/admin", func(r chi.Router) {
			r.Use(authGuard)
			r.Use(customMiddleware.NoCache) // Prevent caching of admin data

			// Hero Section (admin)
			r.Route("/hero", func(r chi.Router) {
				r.Get("/", heroHandler.GetHeroPage)
				r.Patch("/", customMiddleware.RemoveCache(redis, "hero_page_cache", heroHandler.UpdateHeroPage))
			})

			// About Section (admin)
			r.Route("/about", func(r chi.Router) {
				r.Get("/", aboutHandler.GetAboutPage)
				r.Patch("/", customMiddleware.RemoveCache(redis, "about_page_cache", aboutHandler.UpdateAboutPage))

				// About Skills (admin)
				r.Route("/skills", func(r chi.Router) {
					r.Get("/", aboutHandler.GetTechnicalSkills)
					r.Post("/", customMiddleware.RemoveCache(redis, "about_skills_cache", aboutHandler.CreateTechnicalSkill))
					r.Patch("/{id}", customMiddleware.RemoveCache(redis, "about_skills_cache", aboutHandler.UpdateTechnicalSkill))
					r.Delete("/{id}", customMiddleware.RemoveCache(redis, "about_skills_cache", aboutHandler.DeleteTechnicalSkill))
				})

				// About Careers (admin)
				r.Route("/careers", func(r chi.Router) {
					r.Get("/", aboutHandler.GetCareers)
					r.Post("/", customMiddleware.RemoveCache(redis, "about_careers_cache", aboutHandler.CreateCareer))
					r.Patch("/{id}", customMiddleware.RemoveCache(redis, "about_careers_cache", aboutHandler.UpdateCareer))
					r.Delete("/{id}", customMiddleware.RemoveCache(redis, "about_careers_cache", aboutHandler.DeleteCareer))
				})
			})

			// Testimonies (admin)
			r.Route("/testimony", func(r chi.Router) {
				r.Get("/", testimonyHandler.GetTestimonyPage)
				r.Patch("/", customMiddleware.RemoveCache(redis, "testimony_page_cache", testimonyHandler.UpdateTestimonyPage))

				r.Route("/items", func(r chi.Router) {
					r.Get("/", testimonyHandler.GetTestimonies)
					r.Post("/", customMiddleware.RemoveCache(redis, "testimony_approved_cache", testimonyHandler.CreateTestimony))
					r.Patch("/{id}", customMiddleware.RemoveCache(redis, "testimony_approved_cache", testimonyHandler.UpdateTestimony))
					r.Patch("/{id}/approve", customMiddleware.RemoveCache(redis, "testimony_approved_cache", testimonyHandler.ApproveTestimony))
					r.Delete("/{id}", customMiddleware.RemoveCache(redis, "testimony_approved_cache", testimonyHandler.DeleteTestimony))
				})
			})

			// Projects (admin)
			r.Route("/project", func(r chi.Router) {
				r.Get("/", projectHandler.GetProjectPage)
				r.Patch("/", customMiddleware.RemoveCache(redis, "cache:/api/v1/project", projectHandler.UpdateProjectPage))

				r.Route("/items", func(r chi.Router) {
					r.Get("/", projectHandler.GetProjects)
					r.Post("/", customMiddleware.RemoveCache(redis, "cache:/api/v1/project/items", projectHandler.CreateProject))
					r.Patch("/{id}", customMiddleware.RemoveCache(redis, "cache:/api/v1/project/items", projectHandler.UpdateProject))
					r.Delete("/{id}", customMiddleware.RemoveCache(redis, "cache:/api/v1/project/items", projectHandler.DeleteProject))
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
