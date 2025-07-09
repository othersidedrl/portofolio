package testimony

import (
	"context"
	"errors"

	"github.com/othersidedrl/portfolio/backend/internal/models"
	"gorm.io/gorm"
)

type TestimonyRepository interface {
	GetTestimonyPage(ctx context.Context) (*TestimonyPageDto, error)
	UpdateTestimonyPage(ctx context.Context, data *TestimonyPageDto) error
	GetTestimonies(ctx context.Context) (*TestimonyDto, error)
	CreateTestimony(ctx context.Context, data *TestimonyItemDto) error
	UpdateTestimony(ctx context.Context, data *TestimonyItemDto, id uint) error
	DeleteTestimony(ctx context.Context, id uint) error
}

type GormTestimonyRepository struct {
	db *gorm.DB
}

func NewGormTestimonyRepository(db *gorm.DB) *GormTestimonyRepository {
	return &GormTestimonyRepository{db: db}
}

func (r *GormTestimonyRepository) GetTestimonyPage(ctx context.Context) (*TestimonyPageDto, error) {
	var page models.TestimonyPage
	if err := r.db.WithContext(ctx).First(&page).Error; err != nil {
		return nil, err
	}
	return &TestimonyPageDto{
		Title:       page.Title,
		Description: page.Description,
	}, nil
}

func (r *GormTestimonyRepository) UpdateTestimonyPage(ctx context.Context, data *TestimonyPageDto) error {
	var page models.TestimonyPage
	if err := r.db.WithContext(ctx).First(&page).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return r.db.WithContext(ctx).Create(&models.TestimonyPage{
				Title:       data.Title,
				Description: data.Description,
			}).Error
		}
		return err
	}
	page.Title = data.Title
	page.Description = data.Description
	return r.db.WithContext(ctx).Save(&page).Error
}

func (r *GormTestimonyRepository) GetTestimonies(ctx context.Context) (*TestimonyDto, error) {
	var testimonies []models.Testimony
	if err := r.db.WithContext(ctx).Find(&testimonies).Error; err != nil {
		return nil, err
	}
	var dtoTestimonies []TestimonyItemDto
	for _, t := range testimonies {
		dtoTestimonies = append(dtoTestimonies, TestimonyItemDto{
			ID:          int(t.ID),
			Name:        t.Name,
			ProfileUrl:  t.ProfileUrl,
			Affiliation: t.Affiliation,
			Rating:      t.Rating,
			Description: t.Description,
			AISummary:   t.AISummary,
		})
	}
	return &TestimonyDto{Testimonies: dtoTestimonies}, nil
}

func (r *GormTestimonyRepository) CreateTestimony(ctx context.Context, data *TestimonyItemDto) error {
	testimony := models.Testimony{
		Name:        data.Name,
		ProfileUrl:  data.ProfileUrl,
		Affiliation: data.Affiliation,
		Rating:      data.Rating,
		Description: data.Description,
		AISummary:   data.AISummary,
	}
	return r.db.WithContext(ctx).Create(&testimony).Error
}

func (r *GormTestimonyRepository) UpdateTestimony(ctx context.Context, data *TestimonyItemDto, id uint) error {
	return r.db.WithContext(ctx).Where("id = ?", id).Updates(&models.Testimony{
		Name:        data.Name,
		ProfileUrl:  data.ProfileUrl,
		Affiliation: data.Affiliation,
		Rating:      data.Rating,
		Description: data.Description,
		AISummary:   data.AISummary,
	}).Error
}

func (r *GormTestimonyRepository) DeleteTestimony(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).Where("id = ?", id).Unscoped().Delete(&models.Testimony{}).Error
}
