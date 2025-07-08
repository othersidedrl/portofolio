package about

import "context"

type Service struct {
	repo AboutRepository
}

func NewService(repo AboutRepository) *Service {
	return &Service{repo}
}

func (s *Service) Find(ctx context.Context) (*AboutPageDto, error) {
	return s.repo.Find(ctx)
}

func (s *Service) Update(ctx context.Context, data AboutPageDto) error {
	return s.repo.Update(ctx, &data)
}
