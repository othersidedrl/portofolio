package testimony

import "net/http"

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) GetTestimonyPage(w http.ResponseWriter, r *http.Request)    {}
func (h *Handler) UpdateTestimonyPage(w http.ResponseWriter, r *http.Request) {}
func (h *Handler) GetTestimonies(w http.ResponseWriter, r *http.Request)      {}
func (h *Handler) CreateTestimony(w http.ResponseWriter, r *http.Request)     {}
func (h *Handler) UpdateTestimony(w http.ResponseWriter, r *http.Request)     {}
func (h *Handler) DeleteTestimony(w http.ResponseWriter, r *http.Request)     {}
