package about

import (
	"context"
)

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

func (s *Service) GetTechnicalSkills(ctx context.Context) (*TechnicalSkillDto, error) {
	return s.repo.GetTechnicalSkills(ctx)
}

func (s *Service) CreateTechnicalSkill(ctx context.Context, data SkillItemDto) error {
	return s.repo.CreateTechnicalSkill(ctx, &data)
}

func (s *Service) UpdateTechnicalSkill(ctx context.Context, data SkillItemDto, id int) error {
	return s.repo.UpdateTechnicalSkill(ctx, &data, id)
}

func (s *Service) DeleteTechnicalSkill(ctx context.Context, id int) error {
	return s.repo.DeleteTechnicalSkill(ctx, id)
}
