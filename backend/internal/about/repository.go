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
	GetTechnicalSkills(ctx context.Context) (*TechnicalSkillDto, error)
	CreateTechnicalSkill(ctx context.Context, data *SkillItemDto) error
	UpdateTechnicalSkill(ctx context.Context, data *SkillItemDto, id int) error
	DeleteTechnicalSkill(ctx context.Context, id int) error
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
			Title:       c.Title,
			Description: c.Description,
		}
	}

	dto := &AboutPageDto{
		Description:  about.Description,
		Cards:        cards,
		GithubLink:   about.GithubLink,
		LinkedinLink: about.LinkedinLink,
		Available:    about.Available,
	}

	return dto, nil
}

func (r *GormAboutRepository) Update(ctx context.Context, data *AboutPageDto) error {
	var existing models.AboutPage

	err := r.db.WithContext(ctx).Preload("Cards").First(&existing).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			cards := make([]models.AboutCard, len(data.Cards))
			for i, c := range cards {
				cards[i] = models.AboutCard{
					Title:       c.Title,
					Description: c.Description,
				}
			}

			aboutPage := models.AboutPage{
				Description:  data.Description,
				GithubLink:   data.GithubLink,
				LinkedinLink: data.LinkedinLink,
				Available:    data.Available,
				Cards:        cards,
			}
			return r.db.WithContext(ctx).Create(&aboutPage).Error
		}
		return err
	}

	existing.Description = data.Description
	existing.GithubLink = data.GithubLink
	existing.LinkedinLink = data.LinkedinLink
	existing.Available = data.Available

	// Delete old cards and insert new ones (simplest approach)
	if err := r.db.WithContext(ctx).Unscoped().Where("about_page_id = ?", existing.ID).Delete(&models.AboutCard{}).Error; err != nil {
		return err
	}

	cards := make([]models.AboutCard, len(data.Cards))
	for i, c := range data.Cards {
		cards[i] = models.AboutCard{
			Title:       c.Title,
			Description: c.Description,
		}
	}

	existing.Cards = cards

	// Save changes
	return r.db.WithContext(ctx).Save(&existing).Error
}

func (r *GormAboutRepository) GetTechnicalSkills(ctx context.Context) (*TechnicalSkillDto, error) {
	var skills []models.TechnicalSkills

	if err := r.db.WithContext(ctx).Find(&skills).Error; err != nil {
		return nil, err
	}

	// Map to DTO
	var dtoSkills []SkillItemDto
	for _, skill := range skills {
		dtoSkills = append(dtoSkills, SkillItemDto{
			ID:           skill.ID,
			Name:         skill.Name,
			Description:  skill.Description,
			Specialities: skill.Specialities,
			Level:        string(skill.Level),
			Category:     string(skill.Category),
		})
	}

	return &TechnicalSkillDto{
		Skills: dtoSkills,
	}, nil
}

func (r *GormAboutRepository) CreateTechnicalSkill(ctx context.Context, data *SkillItemDto) error {
	skill := models.TechnicalSkills{
		Name:         data.Name,
		Description:  data.Description,
		Specialities: data.Specialities,
		Level:        models.SkillLevel(data.Level),
		Category:     models.Cateogry(data.Category),
	}

	return r.db.WithContext(ctx).Create(&skill).Error
}

func (r *GormAboutRepository) UpdateTechnicalSkill(ctx context.Context, data *SkillItemDto, id int) error {
	return r.db.WithContext(ctx).Where("id = ?", id).Updates(
		models.TechnicalSkills{
			Name:         data.Name,
			Description:  data.Description,
			Specialities: data.Specialities,
			Level:        models.SkillLevel(data.Level),
			Category:     models.Cateogry(data.Category),
		}).Error
}

func (r *GormAboutRepository) DeleteTechnicalSkill(ctx context.Context, id int) error {
	return r.db.WithContext(ctx).Where("id = ?", id).Unscoped().Delete(&models.TechnicalSkills{}).Error
}
