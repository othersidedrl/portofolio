package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/othersidedrl/portfolio/backend/internal/utils"
)

type contextKey string

const userContextKey = contextKey("user")

// AuthGuard checks for a valid JWT in the Authorization header
func AuthGuard(jwt *utils.JWTService) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
				http.Error(w, "Unauthorized: missing or malformed token", http.StatusUnauthorized)
				return
			}

			token := strings.TrimPrefix(authHeader, "Bearer ")
			claims, err := jwt.VerifyToken(token)
			if err != nil {
				http.Error(w, "Unauthorized: invalid token", http.StatusUnauthorized)
				return
			}

			// Store claims in context so handlers can access it
			ctx := context.WithValue(r.Context(), userContextKey, claims)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

// GetUserFromContext retrieves the JWT claims from the request context
func GetUserFromContext(ctx context.Context) *utils.JWTClaims {
	claims, ok := ctx.Value(userContextKey).(*utils.JWTClaims)
	if !ok {
		return nil
	}
	return claims
}
