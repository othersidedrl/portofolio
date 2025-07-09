package models

import (
	"time"

	"gorm.io/gorm"
)

type Testimony struct {
	gorm.Model
	ID          uint      `json:"id" gorm:"primaryKey"`
	Name        string    `json:"name"`
	ProfileUrl  string    `json:"profile_url"`
	Affiliation string    `json:"affiliation"`
	Rating      int       `json:"rating"`
	Description string    `json:"description"`
	AISummary   string    `json:"ai_summary"`
	Approved    bool      `json:"approved"`
	UpdatedAt   time.Time `json:"updated_at"`
	CreatedAt   time.Time `json:"created_at"`
}
