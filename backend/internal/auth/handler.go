package auth

import (
	"encoding/json"
	"net/http"

	"github.com/othersidedrl/portfolio/backend/internal/utils"
)

// Handler is the controller struct.
// It's equivalent to a NestJS controller class with a service dependency.
type Handler struct {
	service *Service
}

// NewHandler returns a new instance of the auth handler.
// It's like injecting AuthService in NestJS.
func NewHandler(service *Service) *Handler {
	return &Handler{service}
}

// Login handles POST /auth/login.
// It's like `@Post('login')` in NestJS.
func (h *Handler) Login(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest

	// Decode the JSON request body
	if err := utils.DecodeBody(r, &req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Call the service layer
	token, err := h.service.Login(req.Email, req.Password)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Return the token in JSON format
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"token": token,
	})
}
