package testimony

type Service struct {
	repo TestimonyRepository
}

func NewService(repo TestimonyRepository) *Service {
	return &Service{repo}
}

func (s *Service) GetTestimonyPage()    {}
func (s *Service) UpdateTestimonyPage() {}
func (s *Service) GetTestimonies()      {}
func (s *Service) CreateTestimony()     {}
func (s *Service) UpdateTestimony()     {}
func (s *Service) DeleteTestimony()     {}
