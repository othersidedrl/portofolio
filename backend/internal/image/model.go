package image

import "mime/multipart"

// UploadResult represents the result of an image upload
type UploadResult struct {
	URL       string `json:"url"`
	PublicID  string `json:"public_id"`
	Format    string `json:"format"`
	Width     int    `json:"width"`
	Height    int    `json:"height"`
	Bytes     int    `json:"bytes"`
	CreatedAt string `json:"created_at"`
}

// UploadOptions represents options for image upload
type UploadOptions struct {
	Folder  string
	Format  string // "webp", "jpg", "png", etc.
	Quality string // "auto", "80", etc.
	Width   int
	Height  int
	Crop    string // "fill", "fit", "scale", etc.
}

// ImageProvider interface for different image services
type ImageProvider interface {
	Upload(file multipart.File, header *multipart.FileHeader, opts *UploadOptions) (*UploadResult, error)
	GetOptimizedURL(publicID string, width, height int) string
	Delete(publicID string) error
}
