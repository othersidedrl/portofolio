package models

import (
	"time"

	"gorm.io/gorm"
)

type HeroPage struct {
	gorm.Model
	ID          uint     `json:"id" gorm:"primaryKey"`
	Name        string   `json:"name"`
	Rank        string   `json:"rank"`
	Title       string   `json:"title"`
	Subtitle    string   `json:"subtitle"`
	ResumeLink  string   `json:"resume_link"`
	ContactLink string   `json:"contact_link"`
	ImageURLs   []string `json:"image_urls"`
	Hobbies     []string `json:"hobbies"`
	UpdatedAt   time.Time `json:"updated_at"`
	CreatedAt   time.Time `json:"created_at"`
}