package models

import (
	"database/sql/driver"
	"fmt"
	"time"

	"github.com/lib/pq"
	"gorm.io/gorm"
)

type SkillLevel string
type Cateogry string

const (
	Beginner     SkillLevel = "Beginner"
	Intermediate SkillLevel = "Intermediate"
	Advanced     SkillLevel = "Advanced"
)

const (
	Backend  Cateogry = "Backend"
	Frontend Cateogry = "Frontend"
	Other    Cateogry = "Other"
)

// Implement the Scanner interface
func (sl *SkillLevel) Scan(value interface{}) error {
	str, ok := value.(string)
	if !ok {
		return fmt.Errorf("cannot scan SkillLevel from %T", value)
	}
	*sl = SkillLevel(str)
	return nil
}

func (sl *Cateogry) Scan(value interface{}) error {
	str, ok := value.(string)
	if !ok {
		return fmt.Errorf("cannot scan Category from %T", value)
	}
	*sl = Cateogry(str)
	return nil
}

// Implement the Valuer interface
func (sl SkillLevel) Value() (driver.Value, error) {
	return string(sl), nil
}
func (sl Cateogry) Value() (driver.Value, error) {
	return string(sl), nil
}

type TechnicalSkills struct {
	gorm.Model
	ID           uint           `json:"id" gorm:"primaryKey"`
	Name         string         `json:"name"`
	Description  string         `json:"description"`
	Specialities pq.StringArray `json:"specialities" gorm:"type:text[]"`
	Level        SkillLevel     `json:"level" gorm:"type:skill_level"`
	Category     Cateogry       `json:"category" gorm:"type:category"`
	UpdatedAt    time.Time      `json:"updated_at"`
	CreatedAt    time.Time      `json:"created_at"`
}
