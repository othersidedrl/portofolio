package project

import "github.com/othersidedrl/portfolio/backend/internal/models"

type ProjectPageDto struct {
	Title       string `json:"title"`
	Description string `json:"description"`
}

type ProjectItemDto struct {
	ID           int                     `json:"id"`
	Name         string                  `json:"name"`
	ImageUrls    []string                `json:"imageUrls"`
	Description  string                  `json:"description"`
	TechStack    []string                `json:"techStack"`
	GithubLink   string                  `json:"githubLink"`
	Type         models.ProjectType      `json:"type"`
	Contribution models.ContributionType `json:"contribution"`
	ProjectLink  string                  `json:"projectLink"`
}

type ProjectDto struct {
	Projects []ProjectItemDto `json:"projects"`
}
