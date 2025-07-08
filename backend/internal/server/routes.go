package server

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/othersidedrl/portfolio/backend/internal/auth"
	"github.com/othersidedrl/portfolio/backend/internal/health"
)

func NewRouter(authHandler *auth.Handler) http.Handler {
	r := chi.NewRouter()

	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	r.Route("/api/v1", func(r chi.Router) {
		// Health check
		r.Get("/health", health.Health)

		// Auth
		r.Route("/auth", func(r chi.Router) {
			r.Post("/login", authHandler.Login)
		})
	})

	return r
}
