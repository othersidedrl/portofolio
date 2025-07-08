package image

import (
	"fmt"
	"mime/multipart"
	"strings"
)

type Service struct {
	provider ImageProvider
}

func NewService() (*Service, error) {
	provider, err := NewCloudinaryProvider()
	if err != nil {
		return nil, fmt.Errorf("failed to create image provider: %w", err)
	}
	return &Service{provider: provider}, nil
}

func (s *Service) Upload(file multipart.File, header *multipart.FileHeader, opts *UploadOptions) (*UploadResult, error) {
	if !isValidImageType(header.Filename) {
		return nil, fmt.Errorf("invalid file type. Allowed: jpg, jpeg, png, webp, gif")
	}
	if header.Size > 5*1024*1024 {
		return nil, fmt.Errorf("file too large (max 5MB)")
	}
	return s.provider.Upload(file, header, opts)
}

func (s *Service) GetOptimizedURL(publicID string, width, height int) string {
	return s.provider.GetOptimizedURL(publicID, width, height)
}

func (s *Service) Delete(publicID string) error {
	return s.provider.Delete(publicID)
}

// Domain-specific helpers
func (s *Service) UploadHeroImage(file multipart.File, header *multipart.FileHeader) (*UploadResult, error) {
	return s.Upload(file, header, &UploadOptions{
		Folder:  "portfolio/hero",
		Format:  "webp",
		Quality: "auto",
	})
}

func (s *Service) UploadProjectImage(file multipart.File, header *multipart.FileHeader) (*UploadResult, error) {
	return s.Upload(file, header, &UploadOptions{
		Folder:  "portfolio/projects",
		Format:  "webp",
		Quality: "auto",
	})
}

func (s *Service) UploadProfileImage(file multipart.File, header *multipart.FileHeader) (*UploadResult, error) {
	return s.Upload(file, header, &UploadOptions{
		Folder:  "portfolio/profile",
		Format:  "webp",
		Quality: "auto",
		Width:   500,
		Height:  500,
		Crop:    "fill",
	})
}

// Utility
func isValidImageType(filename string) bool {
	validExts := []string{".jpg", ".jpeg", ".png", ".webp", ".gif"}
	for _, ext := range validExts {
		if strings.HasSuffix(strings.ToLower(filename), ext) {
			return true
		}
	}
	return false
}
