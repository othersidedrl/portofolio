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

func (s *Service) UpdateTechnicalSkill(ctx context.Context, data SkillItemDto, id uint) error {
	return s.repo.UpdateTechnicalSkill(ctx, &data, id)
}

func (s *Service) DeleteTechnicalSkill(ctx context.Context, id uint) error {
	return s.repo.DeleteTechnicalSkill(ctx, id)
}

func (s *Service) GetCareers(ctx context.Context) (*CareerJourneyDto, error) {
	return s.repo.GetCareers(ctx)
}

func (s *Service) CreateCareer(ctx context.Context, data CareerItemDto) error {
	return s.repo.CreateCareer(ctx, &data)
}

func (s *Service) UpdateCareer(ctx context.Context, data CareerItemDto, id uint) error {
	return s.repo.UpdateCareer(ctx, &data, id)
}

func (s *Service) DeleteCareer(ctx context.Context, id uint) error {
	return s.repo.DeleteCareer(ctx, id)
}
