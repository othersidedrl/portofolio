package hero

import (
	"context"

	"gorm.io/gorm"
)

// HeroRepository defines the interface for data access
type HeroRepository interface {
	Find(ctx context.Context) (*HeroDto, error)
	Update(ctx context.Context, data *HeroDto) error
}

// GormHeroRepository is a GORM-based implementation of HeroRepository
type GormHeroRepository struct {
	db *gorm.DB
}

// NewGormHeroRepository creates a new instance of GormHeroRepository
func NewGormHeroRepository(db *gorm.DB) *GormHeroRepository {
	return &GormHeroRepository{db: db}
}

// Find retrieves the hero page from the database (assumes single row)
func (r *GormHeroRepository) Find(ctx context.Context) (*HeroDto, error) {
	var hero HeroDto
	if err := r.db.WithContext(ctx).First(&hero).Error; err != nil {
		return nil, err
	}
	return &hero, nil
}

// Update modifies the hero page
func (r *GormHeroRepository) Update(ctx context.Context, data *HeroDto) error {
	return r.db.WithContext(ctx).Save(data).Error
}
