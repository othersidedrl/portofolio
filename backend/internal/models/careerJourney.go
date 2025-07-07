package models

import (
	"database/sql/driver"
	"fmt"
	"time"

	"gorm.io/gorm"
)

type CareerType string

const (
	Education CareerType = "Education"
	Job       CareerType = "Job"
)

// Implement the Scanner interface
func (ct *CareerType) Scan(value interface{}) error {
	str, ok := value.(string)
	if !ok {
		return fmt.Errorf("cannot scan CareerType from %T", value)
	}
	*ct = CareerType(str)
	return nil
}

// Implement the Valuer interface
func (ct CareerType) Value() (driver.Value, error) {
	return string(ct), nil
}

type CareerJourney struct {
	gorm.Model
	ID          uint       `json:"id" gorm:"primaryKey"`
	StartedAt   string     `json:"startedAt"`
	EndedAt     string     `json:"endedAt"`
	Title       string     `json:"title"`
	Affiliation string     `json:"affiliation"`
	Description string     `json:"description"`
	Location    string     `json:"location"`
	Type        CareerType `json:"type" gorm:"type:enum('Education','Job')"`
	UpdatedAt   time.Time `json:"updated_at"`
	CreatedAt   time.Time `json:"created_at"`
}
