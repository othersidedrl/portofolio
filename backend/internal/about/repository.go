package about

import (
	"context"
	"errors"

	"github.com/othersidedrl/portfolio/backend/internal/models"
	"gorm.io/gorm"
)

type AboutRepository interface {
	Find(ctx context.Context) (*AboutPageDto, error)
	Update(ctx context.Context, data *AboutPageDto) error
}

type GormAboutRepository struct {
	db *gorm.DB
}

func NewGormAboutRepository(db *gorm.DB) *GormAboutRepository {
	return &GormAboutRepository{db: db}
}

func (r *GormAboutRepository) Find(ctx context.Context) (*AboutPageDto, error) {
	var about models.AboutPage

	// Load AboutPage along with its related AboutCards
	if err := r.db.WithContext(ctx).
		Preload("Cards"). // This loads the []AboutCard slice
		First(&about).Error; err != nil {
		return nil, err
	}

	// Map to DTO
	cards := make([]CardDto, len(about.Cards))
	for i, c := range about.Cards {
		cards[i] = CardDto{
			ID:          c.ID,
			Title:       c.Title,
			Description: c.Description,
			CreatedAt:   c.CreatedAt,
			UpdatedAt:   c.UpdatedAt,
		}
	}

	dto := &AboutPageDto{
		Description: about.Description,
		Cards:       cards,
		GithubLink:  about.GithubLink,
		Available:   true,
		CreatedAt:   about.CreatedAt,
		UpdatedAt:   about.UpdatedAt,
	}

	return dto, nil
}

func (r *GormAboutRepository) Update(ctx context.Context, data *AboutPageDto) error {
	return errors.New("")
}
