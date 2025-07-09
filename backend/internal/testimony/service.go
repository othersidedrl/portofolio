package testimony

import (
	"context"
)

type Service struct {
	repo TestimonyRepository
}

func NewService(repo TestimonyRepository) *Service {
	return &Service{repo}
}

func (s *Service) GetTestimonyPage(ctx context.Context) (*TestimonyPageDto, error) {
	return s.repo.GetTestimonyPage(ctx)
}

func (s *Service) UpdateTestimonyPage(ctx context.Context, data *TestimonyPageDto) error {
	return s.repo.UpdateTestimonyPage(ctx, data)
}

func (s *Service) GetTestimonies(ctx context.Context) (*TestimonyDto, error) {
	return s.repo.GetTestimonies(ctx)
}

func (s *Service) CreateTestimony(ctx context.Context, data *TestimonyItemDto) error {
	return s.repo.CreateTestimony(ctx, data)
}

func (s *Service) UpdateTestimony(ctx context.Context, data *TestimonyItemDto, id uint) error {
	return s.repo.UpdateTestimony(ctx, data, id)
}

func (s *Service) DeleteTestimony(ctx context.Context, id uint) error {
	return s.repo.DeleteTestimony(ctx, id)
}
