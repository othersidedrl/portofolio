package testimony

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) Find()            {}
func (h *Handler) Update()          {}
func (h *Handler) GetTestimonies()  {}
func (h *Handler) CreateTestimony() {}
func (h *Handler) UpdateTestimony() {}
func (h *Handler) DeleteTestimony() {}
