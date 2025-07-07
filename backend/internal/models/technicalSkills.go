package models

import (
	"database/sql/driver"
	"fmt"
	"time"

	"gorm.io/gorm"
)

type SkillLevel string

const (
	Beginner    SkillLevel = "Beginner"
	Intermediate SkillLevel = "Intermediate"
	Advanced    SkillLevel = "Advanced"
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

// Implement the Valuer interface
func (sl SkillLevel) Value() (driver.Value, error) {
	return string(sl), nil
}

type TechnicalSkills struct {
	gorm.Model
	ID           uint        `json:"id" gorm:"primaryKey"`
	Name         string      `json:"name"`
	Description  string      `json:"description"`
	Specialities []string    `json:"specialities"`
	Level        SkillLevel  `json:"level" gorm:"type:enum('Beginner','Intermediate','Advanced')"`
	UpdatedAt    time.Time   `json:"updated_at"`
	CreatedAt    time.Time   `json:"created_at"`
}