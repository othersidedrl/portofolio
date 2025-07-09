package project

import (
	"context"

	"github.com/othersidedrl/portfolio/backend/internal/models"
	"gorm.io/gorm"
)

type ProjectRepository interface {
	GetProjectPage(ctx context.Context) (*ProjectPageDto, error)
	UpdateProjectPage(ctx context.Context, data *ProjectPageDto) error
	GetProjects(ctx context.Context) (*ProjectDto, error)
	CreateProject(ctx context.Context, data *ProjectItemDto) error
	UpdateProject(ctx context.Context, data *ProjectItemDto, id uint) error
	DeleteProject(ctx context.Context, id uint) error
}

type GormProjectRepository struct {
	db *gorm.DB
}

func NewGormProjectRepository(db *gorm.DB) *GormProjectRepository {
	return &GormProjectRepository{db: db}
}

func (r *GormProjectRepository) GetProjectPage(ctx context.Context) (*ProjectPageDto, error) {
	var page models.ProjectPage
	if err := r.db.WithContext(ctx).First(&page).Error; err != nil {
		return nil, err
	}
	return &ProjectPageDto{
		Title:       page.Title,
		Description: page.Description,
	}, nil
}

func (r *GormProjectRepository) UpdateProjectPage(ctx context.Context, data *ProjectPageDto) error {
	var page models.ProjectPage
	if err := r.db.WithContext(ctx).First(&page).Error; err != nil {
		return r.db.WithContext(ctx).Create(&models.ProjectPage{
			Title:       data.Title,
			Description: data.Description,
		}).Error
	}
	page.Title = data.Title
	page.Description = data.Description
	return r.db.WithContext(ctx).Save(&page).Error
}

func (r *GormProjectRepository) GetProjects(ctx context.Context) (*ProjectDto, error) {
	var projects []models.Project
	if err := r.db.WithContext(ctx).Find(&projects).Error; err != nil {
		return nil, err
	}
	var dtoProjects []ProjectItemDto
	for _, p := range projects {
		dtoProjects = append(dtoProjects, ProjectItemDto{
			ID:           int(p.ID),
			Name:         p.Name,
			ImageUrls:    p.ImageUrls,
			Description:  p.Description,
			TechStack:    p.TechStack,
			GithubLink:   p.GithubLink,
			Type:         p.Type,
			Contribution: p.Contribution,
			ProjectLink:  p.ProjectLink,
		})
	}
	return &ProjectDto{Projects: dtoProjects}, nil
}

func (r *GormProjectRepository) CreateProject(ctx context.Context, data *ProjectItemDto) error {
	project := models.Project{
		Name:         data.Name,
		ImageUrls:    data.ImageUrls,
		Description:  data.Description,
		TechStack:    data.TechStack,
		GithubLink:   data.GithubLink,
		Type:         data.Type,
		Contribution: data.Contribution,
		ProjectLink:  data.ProjectLink,
	}
	return r.db.WithContext(ctx).Create(&project).Error
}

func (r *GormProjectRepository) UpdateProject(ctx context.Context, data *ProjectItemDto, id uint) error {
	return r.db.WithContext(ctx).Model(&models.Project{}).Where("id = ?", id).Updates(&models.Project{
		Name:         data.Name,
		ImageUrls:    data.ImageUrls,
		Description:  data.Description,
		TechStack:    data.TechStack,
		GithubLink:   data.GithubLink,
		Type:         data.Type,
		Contribution: data.Contribution,
		ProjectLink:  data.ProjectLink,
	}).Error
}

func (r *GormProjectRepository) DeleteProject(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).Where("id = ?", id).Unscoped().Delete(&models.Project{}).Error
}
