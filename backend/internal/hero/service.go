package hero

import (
	"context"
)

type Service struct {
	repo HeroRepository
}

func NewService(repo HeroRepository) *Service {
	return &Service{
		repo: repo,
	}
}

// Find retrieves the hero page data using the repository
func (s *Service) Find(ctx context.Context) (*HeroPageDto, error) {
	return s.repo.Find(ctx)
}

func (s *Service) Update(ctx context.Context, data HeroPageDto) error {
	return s.repo.Update(ctx, &data)
}
