package testimony

import (
	"context"
	"errors"

	"gorm.io/gorm"
)

type TestimonyRepository interface {
	Find(ctx context.Context) (*TestimonyPageDto, error)
	Update(ctx context.Context, data *TestimonyPageDto) error
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

func (r *GormTestimonyRepository) Find(ctx context.Context) (*TestimonyPageDto, error) {
	return nil, errors.New("")
}
func (r *GormTestimonyRepository) Update(ctx context.Context, data *TestimonyPageDto) error {
	return errors.New("")
}
func (r *GormTestimonyRepository) GetTestimonies(ctx context.Context) (*TestimonyDto, error) {
	return nil, errors.New("")
}
func (r *GormTestimonyRepository) CreateTestimony(ctx context.Context, data *TestimonyItemDto) error {
	return errors.New("")
}
func (r *GormTestimonyRepository) UpdateTestimony(ctx context.Context, data *TestimonyItemDto, id uint) error {
	return errors.New("")
}
func (r *GormTestimonyRepository) DeleteTestimony(ctx context.Context, id uint) error {
	return errors.New("")
}
