package models

import (
	"time"

	"gorm.io/gorm"
)

type AboutPage struct {
	gorm.Model
	ID           uint        `json:"id" gorm:"primaryKey"`
	Description  string      `json:"description"`
	Cards        []AboutCard `json:"cards" gorm:"foreignKey:AboutPageID"`
	GithubLink   string      `json:"github_link"`
	LinkedinLink string      `json:"linkedin_link"`
	Available    bool        `json:"available"`
	UpdatedAt    time.Time   `json:"updated_at"`
	CreatedAt    time.Time   `json:"created_at"`
}
