package testimony

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/othersidedrl/portfolio/backend/internal/utils"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) GetTestimonyPage(w http.ResponseWriter, r *http.Request) {
	page, err := h.service.GetTestimonyPage(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(page)
}

func (h *Handler) UpdateTestimonyPage(w http.ResponseWriter, r *http.Request) {
	var body TestimonyPageDto
	if err := utils.DecodeBody(r, &body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	if err := h.service.UpdateTestimonyPage(r.Context(), &body); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Testimony page updated"})
}

func (h *Handler) GetTestimonies(w http.ResponseWriter, r *http.Request) {
	testimonies, err := h.service.GetTestimonies(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if testimonies == nil {
		testimonies = &TestimonyDto{Testimonies: []TestimonyItemDto{}}
	}
	response := map[string]interface{}{
		"length": len(testimonies.Testimonies),
		"data":   testimonies.Testimonies,
	}
	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func (h *Handler) CreateTestimony(w http.ResponseWriter, r *http.Request) {
	var body TestimonyItemDto
	if err := utils.DecodeBody(r, &body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	if err := h.service.CreateTestimony(r.Context(), &body); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Successfully created a testimony"})
}

func (h *Handler) UpdateTestimony(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		http.Error(w, "Invalid testimony ID", http.StatusBadRequest)
		return
	}
	var body TestimonyItemDto
	if err := utils.DecodeBody(r, &body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	if err := h.service.UpdateTestimony(r.Context(), &body, uint(id)); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Testimony updated"})
}

func (h *Handler) DeleteTestimony(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		http.Error(w, "Invalid testimony ID", http.StatusBadRequest)
		return
	}
	if err := h.service.DeleteTestimony(r.Context(), uint(id)); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
	w.Header().Set("Content-Type", "application/json")
}
