package server

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	chiMiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/othersidedrl/portfolio/backend/internal/auth"
	"github.com/othersidedrl/portfolio/backend/internal/health"
	"github.com/othersidedrl/portfolio/backend/internal/hero"
	customMiddleware "github.com/othersidedrl/portfolio/backend/internal/middleware"
	"github.com/othersidedrl/portfolio/backend/internal/utils"
)

func NewRouter(authHandler *auth.Handler, heroHandler *hero.Handler, jwtService *utils.JWTService) http.Handler {
	r := chi.NewRouter()

	r.Use(chiMiddleware.Logger)
	r.Use(chiMiddleware.Recoverer)

	r.Route("/api/v1", func(r chi.Router) {
		// Health check
		r.Get("/health", health.Health)

		// Auth
		r.Route("/auth", func(r chi.Router) {
			r.With(customMiddleware.AuthGuard(jwtService)).Get("/me", authHandler.Me)
			r.Post("/login", authHandler.Login)
		})

		// Pages
		r.Route("/hero", func(r chi.Router) {

		})
	})

	return r
}
