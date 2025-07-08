package server

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	chiMiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/othersidedrl/portfolio/backend/internal/about"
	"github.com/othersidedrl/portfolio/backend/internal/auth"
	"github.com/othersidedrl/portfolio/backend/internal/health"
	"github.com/othersidedrl/portfolio/backend/internal/hero"
	customMiddleware "github.com/othersidedrl/portfolio/backend/internal/middleware"
	"github.com/othersidedrl/portfolio/backend/internal/utils"
)

func NewRouter(
	authHandler *auth.Handler,
	heroHandler *hero.Handler,
	aboutHandler *about.Handler,
	jwtService *utils.JWTService,
) http.Handler {
	r := chi.NewRouter()

	r.Use(chiMiddleware.Logger)
	r.Use(chiMiddleware.Recoverer)

	authGuard := customMiddleware.AuthGuard(jwtService)

	r.Route("/api/v1", func(r chi.Router) {
		// Health check
		r.Get("/health", health.Health)

		// Auth
		r.Route("/auth", func(r chi.Router) {
			r.With(authGuard).Get("/me", authHandler.Me)
			r.Post("/login", authHandler.Login)
		})

		// Hero Section
		r.Route("/hero", func(r chi.Router) {
			r.With(authGuard).Patch("/", heroHandler.UpdatePage)
			r.Get("/", heroHandler.GetPageData)
		})

		// About Section
		r.Route("/about", func(r chi.Router) {
			r.With(authGuard).Patch("/", aboutHandler.UpdatePage)
			r.Get("/", aboutHandler.GetPageData)
		})
	})

	return r
}
