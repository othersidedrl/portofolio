package about

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/othersidedrl/portfolio/backend/internal/utils"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service}
}

func (h *Handler) GetPageData(w http.ResponseWriter, r *http.Request) {
	about, err := h.service.Find(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(about)
}

func (h *Handler) UpdatePage(w http.ResponseWriter, r *http.Request) {
	var body AboutPageDto

	if err := utils.DecodeBody(r, &body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := h.service.Update(r.Context(), body); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "About page updated"})
}

func (h *Handler) GetTechnicalSkills(w http.ResponseWriter, r *http.Request) {
	skills, err := h.service.GetTechnicalSkills(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if skills == nil {
		skills = &TechnicalSkillDto{Skills: []SkillItemDto{}}
	}

	response := map[string]interface{}{
		"length": len(skills.Skills),
		"data":   skills.Skills,
	}

	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func (h *Handler) CreateTechnicalSkill(w http.ResponseWriter, r *http.Request) {
	var body SkillItemDto

	if err := utils.DecodeBody(r, &body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := h.service.CreateTechnicalSkill(r.Context(), body); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response := map[string]interface{}{
		"message": "Successfuly created a skill",
		"data":    body,
	}

	w.WriteHeader(http.StatusCreated)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func (h *Handler) UpdateTechnicalSkill(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		http.Error(w, "Invalid skill ID", http.StatusBadRequest)
		return
	}

	var body SkillItemDto

	if err := utils.DecodeBody(r, &body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := h.service.UpdateTechnicalSkill(r.Context(), body, id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	log.Printf("✅ Skill %d updated successfully", id)

	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Skill updated"})
}

func (h *Handler) DeleteTechnicalSkill(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		http.Error(w, "Invalid skill ID", http.StatusBadRequest)
		return
	}

	if err := h.service.DeleteTechnicalSkill(r.Context(), id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	log.Printf("✅ Skill %d deleted successfully", id)

	w.WriteHeader(http.StatusNoContent)
	w.Header().Set("Content-Type", "application/json")
}
