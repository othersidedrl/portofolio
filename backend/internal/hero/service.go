package hero

type Service struct {
	repo HeroRepository
}

func NewService(repo HeroRepository) *Service {
	return &Service{
		repo: repo,
	}
}
