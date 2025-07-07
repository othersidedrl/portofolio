package models

import (
	"database/sql/driver"
	"fmt"
	"gorm.io/gorm"
	"time"
)

type ProjectType string

type ContributionType string

const (
	Web          ProjectType = "Web"
	Mobile       ProjectType = "Mobile"
	MachineLearning ProjectType = "Machine Learning"

	Personal ContributionType = "Personal"
	Team     ContributionType = "Team"
)

// Scanner and Valuer for ProjectType
func (pt *ProjectType) Scan(value interface{}) error {
	str, ok := value.(string)
	if !ok {
		return fmt.Errorf("cannot scan ProjectType from %T", value)
	}
	*pt = ProjectType(str)
	return nil
}

func (pt ProjectType) Value() (driver.Value, error) {
	return string(pt), nil
}

// Scanner and Valuer for ContributionType
func (ct *ContributionType) Scan(value interface{}) error {
	str, ok := value.(string)
	if !ok {
		return fmt.Errorf("cannot scan ContributionType from %T", value)
	}
	*ct = ContributionType(str)
	return nil
}

func (ct ContributionType) Value() (driver.Value, error) {
	return string(ct), nil
}

type Project struct {
	gorm.Model
	ID            uint             `json:"id" gorm:"primaryKey"`
	Name          string           `json:"name"`
	ImageUrls     []string         `json:"imageUrls" gorm:"type:text[]"`
	Description   string           `json:"description"`
	TechStack     []string         `json:"techStack" gorm:"type:text[]"`
	GithubLink    string           `json:"githubLink"`
	Type          ProjectType      `json:"type" gorm:"type:project_type"`
	Contribution  ContributionType `json:"contribution" gorm:"type:contribution_type"`
	ProjectLink   string           `json:"projectLink"`
	UpdatedAt     time.Time        `json:"updated_at"`
	CreatedAt     time.Time        `json:"created_at"`
}