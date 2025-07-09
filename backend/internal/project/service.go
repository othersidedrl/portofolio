package project

import (
	"context"
)

type Service struct {
	repo ProjectRepository
}

func NewService(repo ProjectRepository) *Service {
	return &Service{repo}
}

func (s *Service) GetProjectPage(ctx context.Context) (*ProjectPageDto, error) {
	return s.repo.GetProjectPage(ctx)
}

func (s *Service) UpdateProjectPage(ctx context.Context, data *ProjectPageDto) error {
	return s.repo.UpdateProjectPage(ctx, data)
}

func (s *Service) GetProjects(ctx context.Context) (*ProjectDto, error) {
	return s.repo.GetProjects(ctx)
}

func (s *Service) CreateProject(ctx context.Context, data *ProjectItemDto) error {
	return s.repo.CreateProject(ctx, data)
}

func (s *Service) UpdateProject(ctx context.Context, data *ProjectItemDto, id uint) error {
	return s.repo.UpdateProject(ctx, data, id)
}

func (s *Service) DeleteProject(ctx context.Context, id uint) error {
	return s.repo.DeleteProject(ctx, id)
}
