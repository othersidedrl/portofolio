package testimony

type Service struct {
	repo TestimonyRepository
}

func NewService(repo TestimonyRepository) *Service {
	return &Service{repo}
}

func (s *Service) Find()            {}
func (s *Service) Update()          {}
func (s *Service) GetTestimonies()  {}
func (s *Service) CreateTestimony() {}
func (s *Service) UpdateTestimony() {}
func (s *Service) DeleteTestimony() {}
