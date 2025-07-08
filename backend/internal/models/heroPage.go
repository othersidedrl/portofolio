package models

import (
	"time"

	"github.com/lib/pq"
	"gorm.io/gorm"
)

type HeroPage struct {
	gorm.Model
	ID          uint           `json:"id" gorm:"primaryKey"`
	Name        string         `json:"name"`
	Rank        string         `json:"rank"`
	Title       string         `json:"title"`
	Subtitle    string         `json:"subtitle"`
	ResumeLink  string         `json:"resume_link"`
	ContactLink string         `json:"contact_link"`
	ImageURLs   pq.StringArray `json:"image_urls" gorm:"type:text[]"`
	Hobbies     pq.StringArray `json:"hobbies" gorm:"type:text[]"`
	UpdatedAt   time.Time      `json:"updated_at"`
	CreatedAt   time.Time      `json:"created_at"`
}
